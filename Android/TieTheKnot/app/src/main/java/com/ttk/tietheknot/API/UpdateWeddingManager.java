package com.ttk.tietheknot.API;

import com.google.gson.JsonObject;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UpdateWeddingManager {

    private ApiService apiService;

    public UpdateWeddingManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void updateWedding(String authToken, String clientId, JsonObject updateRequestBody, ApiManager.OnApiCallCompleteListener<JsonObject> listener) {
        Call<JsonObject> call = apiService.updateWedding(authToken, clientId, updateRequestBody);

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
