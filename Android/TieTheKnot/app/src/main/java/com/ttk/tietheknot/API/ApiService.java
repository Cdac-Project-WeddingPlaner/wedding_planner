package com.ttk.tietheknot.API;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.*;

public interface ApiService {

    @GET("plans")
    Call<JsonArray> getAllPlans();

    @POST("/auth/login")
    Call<JsonObject> login(@Body JsonObject loginParams);

    @Multipart
    @POST("/auth/register/vendor")
    Call<JsonObject> registerVendor(
            @Part("email") RequestBody email,
            @Part("password") RequestBody password,
            @Part("first_name") RequestBody firstName,
            @Part("middle_name") RequestBody middleName,
            @Part("last_name") RequestBody lastName,
            @Part("phone_number") RequestBody phoneNumber,
            @Part("address") RequestBody address,
            @Part("service_type") RequestBody serviceType,
            @Part("business_name") RequestBody businessName,
            @Part("contact_email") RequestBody contactEmail,
            @Part("altarnet_number") RequestBody altarnetNumber,
            @Part("business_address") RequestBody businessAddress,
            @Part("description") RequestBody description,
            @Part MultipartBody.Part logoImage
    );

    @Multipart
    @POST("/auth/register/client")
    Call<JsonObject> registerClient(
            @Part("email") RequestBody email,
            @Part("password") RequestBody password,
            @Part("first_name") RequestBody firstName,
            @Part("last_name") RequestBody lastName,
            @Part("phone_number") RequestBody phoneNumber,
            @Part("address") RequestBody address,
            @Part MultipartBody.Part avatarImage
    );

    @GET("/client/{user_id}")
    Call<JsonObject> getClientById(
            @Header("x-auth-token") String authToken,
            @Path("user_id") String userId

    );

    @PUT("/client/{client_id}")
    Call<Void> updateClient(
            @Header("x-auth-token") String authToken,
            @Path("client_id") String clientId,
            @Body JsonObject updateRequestBody
    );
}
