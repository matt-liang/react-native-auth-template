package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var client *mongo.Client
var jwtKey = []byte("my_secret_key")

type Credentials struct {
	Username    string `json:"username,omitempty" bson:"username,omitempty"`
	Password    string `json:"password,omitempty" bson:"password,omitempty"`
	Phonenumber string `json:"phonenumber,omitempty" bson:"phonenumber,omitempty"`
}

type Claims struct {
	Username string `json:"username,omitempty" bson:"username,omitempty"`
	jwt.StandardClaims
}

type Expiration struct {
	ExpiresAt int64 `json:"expiresat" bson:"expiresat"`
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Check to see if the username already exists in our collection
	collection := client.Database("AuthLabs").Collection("CredentialSet")
	_, err = findUser(w, r, *collection, creds.Username)
	// If the err is not ErrNoDocuments, that means we have found the request username in our
	// collection, and we write a http status client error
	if err != mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Salt and hash the password and replace the password key value pair
	// decoded into creds struct
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)
	if err != nil {
		log.Fatal(err)
	}
	creds.Password = string(hashedPassword)
	result, err := collection.InsertOne(context.TODO(), creds)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	collection := client.Database("AuthLabs").Collection("CredentialSet")
	storedCreds, err := findUser(w, r, *collection, creds.Username)
	if err != nil {
		log.Fatal(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
	}

	// If we end up here, the password passed from client matches what is stored
	// Declare the expiration time of token which we set to 15 seconds
	expirationTime := time.Now().Add(15 * time.Second)

	claims := &Claims{
		Username: creds.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Set the client cookie for "token" as the JWT we generated
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})

	var expiry Expiration
	expiry.ExpiresAt = expirationTime.UnixMilli()

	// We send the unix expiration time in JSON in response writer
	// For use on the front end
	json.NewEncoder(w).Encode(expiry)
}

func AuthorizedHandler(w http.ResponseWriter, r *http.Request) {
	// Obtain the session token from request cookies, which come with every request
	c, err := r.Cookie("token")
	if err != nil {
		// If the cookie does not exist (or expired), return an unauthorized status
		// and write forbidden
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("JWT Expired"))
			return
		}
		// For any other error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Get JWT string from cookie
	tokenStr := c.Value
	claims := &Claims{}

	// Parse the JWT string and store result in 'claims'
	tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
	}

	w.Write([]byte(fmt.Sprintf("Welcome %s!", claims.Username)))
}

func RefreshToken(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := c.Value
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(tkn *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(30 * time.Second)
	claims.ExpiresAt = expirationTime.Unix()
	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	newTokenStr, err := newToken.SignedString(jwtKey)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Set the new token as the users token cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   newTokenStr,
		Expires: expirationTime,
	})

	w.Header().Set("content-type", "application/json")
	var expiry Expiration
	expiry.ExpiresAt = expirationTime.UnixMilli()

	// We send the unix expiration time in JSON in response writer
	// For use on the front end
	json.NewEncoder(w).Encode(expiry)
}

func main() {
	fmt.Println("Starting the application...")
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, _ = mongo.Connect(context.TODO(), clientOptions)
	router := mux.NewRouter()
	router.HandleFunc("/signup", SignUp).Methods("POST")
	router.HandleFunc("/login", Login).Methods("POST")
	router.HandleFunc("/authorizedhandler", AuthorizedHandler).Methods("GET")
	router.HandleFunc("/refreshtoken", RefreshToken).Methods("POST")
	err := http.ListenAndServe(":8080", router)
	fmt.Print(err)
}
