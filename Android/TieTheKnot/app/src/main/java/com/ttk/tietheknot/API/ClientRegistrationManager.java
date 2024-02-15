package com.ttk.tietheknot.API;

import com.google.gson.JsonObject;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.File;

public class ClientRegistrationManager {

    private ApiService apiService;

    public ClientRegistrationManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void registerClient(String email, String password, String firstName, String lastName,
                               String phoneNumber, String address, File avatarImage,
                               final ApiManager.OnApiCallCompleteListener<JsonObject> listener) {

        // Create RequestBody instances from parameters
        RequestBody emailBody = createPartFromString(email);
        RequestBody passwordBody = createPartFromString(password);
        RequestBody firstNameBody = createPartFromString(firstName);
        RequestBody lastNameBody = createPartFromString(lastName);
        RequestBody phoneNumberBody = createPartFromString(phoneNumber);
        RequestBody addressBody = createPartFromString(address);

        // Create MultipartBody.Part for avatar image
        MultipartBody.Part avatarImagePart = null;
        if (avatarImage != null) {
            RequestBody avatarImageRequestBody = RequestBody.create(MediaType.parse("image/*"), avatarImage);
            avatarImagePart = MultipartBody.Part.createFormData("avatar_image_url", avatarImage.getName(), avatarImageRequestBody);
        }

        Call<JsonObject> call = apiService.registerClient(
                emailBody, passwordBody, firstNameBody, lastNameBody,
                phoneNumberBody, addressBody, avatarImagePart
        );

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

    private RequestBody createPartFromString(String data) {
        return RequestBody.create(MediaType.parse("text/plain"), data);
    }
}
