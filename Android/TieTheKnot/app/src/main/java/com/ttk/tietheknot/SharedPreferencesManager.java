package com.ttk.tietheknot;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPreferencesManager {
    private static final String PREF_NAME = "LoginPreferences";
    private static final String KEY_AUTH_TOKEN = "token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_ROLE = "role";
    private static final String KEY_FIRST_NAME = "first_name";
    private static final String KEY_CLIENT_EMAIL = "client_email";

    private final SharedPreferences sharedPreferences;

    public SharedPreferencesManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public String getAuthToken() {
        return sharedPreferences.getString(KEY_AUTH_TOKEN, null);
    }

    public String getUserId() {
        return sharedPreferences.getString(KEY_USER_ID, null);
    }

    public String getUserRole() {
        return sharedPreferences.getString(KEY_USER_ROLE, null);
    }

    public String getFirstName() {
        return sharedPreferences.getString(KEY_FIRST_NAME, null);
    }

    public String getClientEmail() {
        return sharedPreferences.getString(KEY_CLIENT_EMAIL, null);
    }

    public void saveAuthToken(String authToken) {
        sharedPreferences.edit().putString(KEY_AUTH_TOKEN, authToken).apply();
    }

    public void saveUserId(String userId) {
        sharedPreferences.edit().putString(KEY_USER_ID, userId).apply();
    }

    public void saveUserRole(String userRole) {
        sharedPreferences.edit().putString(KEY_USER_ROLE, userRole).apply();
    }

    public void saveFirstName(String firstName) {
        sharedPreferences.edit().putString(KEY_FIRST_NAME, firstName).apply();
    }

    public void saveClientEmail(String clientEmail) {
        sharedPreferences.edit().putString(KEY_CLIENT_EMAIL, clientEmail).apply();
    }

    // Add other necessary methods to store and retrieve client data
}
