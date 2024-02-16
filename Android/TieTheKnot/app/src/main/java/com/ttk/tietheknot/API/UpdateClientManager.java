package com.ttk.tietheknot.API;

import android.util.Log;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.API.ApiResponseHandler;
import com.ttk.tietheknot.API.ApiService;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UpdateClientManager {

    private ApiService apiService;

    public UpdateClientManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void updateClient(String authToken, String clientId, JsonObject updateRequestBody, ApiManager.OnApiCallCompleteListener<Void> listener) {
        Call<Void> call = apiService.updateClient(authToken, clientId, updateRequestBody);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Log.d("UpdateClientManager", "Response body: " + response.body());
                ApiResponseHandler.handleApiResponse(response, listener);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onFailure("Network error: " + t.getMessage());
            }
        });
    }
}
