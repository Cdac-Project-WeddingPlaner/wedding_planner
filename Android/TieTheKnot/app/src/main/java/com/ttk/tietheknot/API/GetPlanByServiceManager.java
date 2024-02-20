package com.ttk.tietheknot.API;

import com.google.gson.JsonArray;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetPlanByServiceManager {

    private ApiService apiService;

    public GetPlanByServiceManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void getPlanByService(String service, final ApiManager.OnApiCallCompleteListener<JsonArray> listener) {
        Call<JsonArray> call = apiService.getPlanByService(service);
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
