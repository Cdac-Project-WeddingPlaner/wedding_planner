package com.ttk.tietheknot.API;

import android.util.Log;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.ttk.tietheknot.API.ApiManager;

import java.io.IOException;

import retrofit2.Response;

public class ApiResponseHandler {

    public static <T> void handleApiResponse(Response<T> response, ApiManager.OnApiCallCompleteListener<T> listener) {
        if (response.isSuccessful()) {
            T responseData = response.body();
            listener.onSuccess(responseData);
        } else {
            handleApiError(response, listener);
        }
    }

    private static <T> void handleApiError(Response<T> response, ApiManager.OnApiCallCompleteListener<T> listener) {
        int statusCode = response.code();
        Log.d("ApiResponseHandler", "Received response with status code: " + statusCode);

        try {
            if (response.errorBody() != null) {
                String errorBody = response.errorBody().string();
                if (errorBody.startsWith("{")) {
                    // Error response is a JSON object
                    handleJsonObjectError(errorBody, listener);
                } else if (errorBody.startsWith("[")) {
                    // Error response is a JSON array
                    handleJsonArrayError(errorBody, listener);
                } else {
                    listener.onFailure("HTTP Code " + statusCode + ": " + errorBody);
                }
            } else {
                listener.onFailure("HTTP Code " + statusCode + ": Empty response body");
            }
        } catch (IOException e) {
            listener.onFailure("IOException while handling error response. Error: " + e.getMessage());
            Log.e("ApiResponseHandler", "IOException: " + e.getMessage());
        }
    }

    private static <T> void handleJsonObjectError(String errorBody, ApiManager.OnApiCallCompleteListener<T> listener) {
        try {
            JsonObject errorJson = JsonParser.parseString(errorBody).getAsJsonObject();
            handleErrorMessage(errorJson, listener);
        } catch (JsonSyntaxException e) {
            listener.onFailure("Failed to parse error response. Error: " + e.getMessage());
            Log.e("ApiResponseHandler", "JsonSyntaxException: " + e.getMessage());
        }
    }

    private static <T> void handleJsonArrayError(String errorBody, ApiManager.OnApiCallCompleteListener<T> listener) {
        try {
            JsonArray errorArray = JsonParser.parseString(errorBody).getAsJsonArray();
            // Handle each element in the array individually
            for (JsonElement element : errorArray) {
                handleErrorMessage(element.getAsJsonObject(), listener);
            }
        } catch (JsonSyntaxException e) {
            listener.onFailure("Failed to parse error response. Error: " + e.getMessage());
            Log.e("ApiResponseHandler", "JsonSyntaxException: " + e.getMessage());
        }
    }

    private static <T> void handleErrorMessage(JsonObject errorJson, ApiManager.OnApiCallCompleteListener<T> listener) {
        if (errorJson.has("error")) {
            String errorMessage = errorJson.get("error").getAsString();
            listener.onFailure(errorMessage);
        } else {
            listener.onFailure(errorJson.toString());
        }
    }
}
