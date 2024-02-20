package com.ttk.tietheknot.API;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import com.google.gson.GsonBuilder;

public class RetrofitBuilder {
    private static final String BASE_URL = URL.Url;

    private static Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(new GsonBuilder().setLenient().create()))
            .build();

    public static ApiService createApiService() {
        return retrofit.create(ApiService.class);
    }
}
