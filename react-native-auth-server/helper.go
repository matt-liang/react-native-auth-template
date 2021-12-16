package main

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Helper function to find a credential struct based on user
// Returns a credential struct and error
func findUser(w http.ResponseWriter, r *http.Request, coll mongo.Collection, username string) (Credentials, error) {
	var creds Credentials
	err := coll.FindOne(context.TODO(), bson.M{"username": username}).Decode(&creds)
	if err == mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusBadRequest)
		return creds, err
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return creds, err
	}
	return creds, nil
}
