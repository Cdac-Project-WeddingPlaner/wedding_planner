package com.ttk.tietheknot.API;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddPlanInSelectinManager {

    private ApiService apiService;

    public AddPlanInSelectinManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void addPlanInSelectin(String token, String user_id, JsonObject planData, final ApiManager.OnApiCallCompleteListener<JsonObject> listener) {
        Call<JsonObject> call = apiService.addPlanInselection(token,user_id,planData);

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
