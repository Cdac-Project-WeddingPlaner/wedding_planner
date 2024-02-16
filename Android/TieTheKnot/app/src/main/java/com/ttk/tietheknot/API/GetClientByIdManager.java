package com.ttk.tietheknot.API;

import android.util.Log;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetClientByIdManager {

    private ApiService apiService;
    private String authToken;

    public GetClientByIdManager(ApiService apiService) {
        this.apiService = apiService;
        this.authToken = authToken;
    }

    public void getClientById(String authToken, String userId, final ApiManager.OnApiCallCompleteListener<JsonObject> listener) {
        Log.e("GMuuu" , userId);
        Log.e("GMaaa" , authToken);

        Call<JsonObject> call = apiService.getClientById(authToken, userId);

        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                ApiResponseHandler.handleApiResponse(response, listener);
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                listener.onFailure("Network error: " + t.getMessage());
            }
        });
    }
}
