package com.ttk.tietheknot;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.ttk.tietheknot.LoginActivity;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.client.ClientMyPlanFrag;
import com.ttk.tietheknot.client.ClientProfileFrag;

public class MainActivity extends AppCompatActivity {

    private Button loginButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

       // Toolbar toolbar = findViewById(R.id.toolbar);
       // setSupportActionBar(toolbar);

        // Enable home button
//        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
//        getSupportActionBar().setDisplayShowHomeEnabled(true);
//        getSupportActionBar().setTitle("Tie The Knot");

        // Disable the back button
      //  getSupportActionBar().setDisplayHomeAsUpEnabled(false);

        loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openLoginActivity();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.nav, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        String itemName = item.getTitle().toString();
        Log.e("MenuItemClicked", "Item Name: " + itemName);

        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

//        switch (itemName) {
//            case "Home":
//                // Replace the current fragment with the HomeFragment
//                break;
//
//            case "Profile":
//                // Replace the current fragment with the ProfileFragment
//                replaceFragment(new ClientProfileFrag());
//                break;
//
//            case "My Plan":
//                // Replace the current fragment with the MyPlanFragment
//                replaceFragment(new ClientMyPlanFrag());
//                break;
//        }

        return super.onOptionsItemSelected(item);
    }


    private void openLoginActivity() {
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }
}
