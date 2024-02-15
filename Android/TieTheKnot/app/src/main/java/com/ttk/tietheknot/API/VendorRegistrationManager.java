package com.ttk.tietheknot.API;

import com.google.gson.JsonObject;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.File;

public class VendorRegistrationManager {

    private ApiService apiService;

    public VendorRegistrationManager(ApiService apiService) {
        this.apiService = apiService;
    }

    public void registerVendor(String email, String password, String firstName, String middleName, String lastName,
                               String phoneNumber, String address, String serviceType, String businessName,
                               String contactEmail, String altarnetNumber, String businessAddress, String description,
                               File logoImage, final ApiManager.OnApiCallCompleteListener<JsonObject> listener) {

        // Create RequestBody instances from parameters
        RequestBody emailBody = createPartFromString(email);
        RequestBody passwordBody = createPartFromString(password);
        RequestBody firstNameBody = createPartFromString(firstName);
        RequestBody middleNameBody = createPartFromString(middleName);
        RequestBody lastNameBody = createPartFromString(lastName);
        RequestBody phoneNumberBody = createPartFromString(phoneNumber);
        RequestBody addressBody = createPartFromString(address);
        RequestBody serviceTypeBody = createPartFromString(serviceType);
        RequestBody businessNameBody = createPartFromString(businessName);
        RequestBody contactEmailBody = createPartFromString(contactEmail);
        RequestBody altarnetNumberBody = createPartFromString(altarnetNumber);
        RequestBody businessAddressBody = createPartFromString(businessAddress);
        RequestBody descriptionBody = createPartFromString(description);

        // Create MultipartBody.Part for logo image
        MultipartBody.Part logoImagePart = null;
        if (logoImage != null) {
            RequestBody logoImageRequestBody = RequestBody.create(MediaType.parse("image/*"), logoImage);
            logoImagePart = MultipartBody.Part.createFormData("logo_image_url", logoImage.getName(), logoImageRequestBody);
        }

        Call<JsonObject> call = apiService.registerVendor(
                emailBody, passwordBody, firstNameBody, middleNameBody, lastNameBody,
                phoneNumberBody, addressBody, serviceTypeBody, businessNameBody,
                contactEmailBody, altarnetNumberBody, businessAddressBody, descriptionBody,
                logoImagePart
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
