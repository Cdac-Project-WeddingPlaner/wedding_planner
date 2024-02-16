package com.ttk.tietheknot.API;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import retrofit2.Response;

public class ApiResponseHandler {

    public static <T> void handleApiResponse(Response<T> response, ApiManager.OnApiCallCompleteListener<T> listener) {
        if (response.isSuccessful()) {
          //  Log.e("aaaa" , response.body().toString());
            T responseData = response.body();
//            if (responseData != null) {
                listener.onSuccess(responseData);
//            } else {
//                listener.onFailure("Response body is null");
//            }
        } else {
            handleApiError(response, listener);
        }
    }

    private static <T> void handleApiError(Response<T> response, ApiManager.OnApiCallCompleteListener<T> listener) {
        int statusCode = response.code();
        Log.d("ApiManager", "Received response with status code: " + statusCode);

        try {
            String errorBody = response.errorBody() != null ? response.errorBody().string() : "";

            if (errorBody.startsWith("\"") || errorBody.startsWith("{")) {
                JsonObject errorJson = new Gson().fromJson(errorBody, JsonObject.class);

                if (errorJson.has("error")) {
                    String errorMessage = errorJson.get("error").getAsString();
                    listener.onFailure(errorMessage);
                } else {
                    listener.onFailure(errorJson.toString());
                }
            } else {
                listener.onFailure("HTTP Code " + statusCode + ": " + errorBody);
            }
        } catch (JsonSyntaxException e) {
            listener.onFailure("Failed to parse error response. Error: " + e.getMessage());
        } catch (Exception e) {
            listener.onFailure("Unknown error occurred. Error: " + e.getMessage());
        }
    }

}
