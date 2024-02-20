package com.ttk.tietheknot.API;

import com.google.gson.JsonArray;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.API.ApiService;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetWiddingDeByUIdManager {

    private ApiService apiService;

    public GetWiddingDeByUIdManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void getWeddingDeByUId(String authToken, String userId, final ApiManager.OnApiCallCompleteListener<JsonArray> listener) {
        Call<JsonArray> call = apiService.getWeddingDeByUId(authToken, userId);
        call.enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                ApiResponseHandler.handleApiResponse(response, listener);
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                listener.onFailure("Network error: " + t.getMessage());
            }
        });
    }
}
