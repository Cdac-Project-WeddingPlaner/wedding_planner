package com.ttk.tietheknot.API;

import android.util.Log;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginManager {

    private ApiService apiService;

    public LoginManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void login(String email, String password, final ApiManager.OnApiCallCompleteListener<JsonObject> listener) {
        JsonObject loginParams = new JsonObject();
        loginParams.addProperty("email", email);
        loginParams.addProperty("password", password);

        Call<JsonObject> call = apiService.login(loginParams);

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
