// DatePickerFragment.java

package com.ttk.tietheknot;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.widget.DatePicker;
import android.widget.EditText;

import androidx.fragment.app.DialogFragment;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DatePickerFragment extends DialogFragment implements DatePickerDialog.OnDateSetListener {

    private OnDateSetListener onDateSetListener;
    private String initialDate;

    public interface OnDateSetListener {
        void onDateSet(String formattedDate);
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the current date as the default date in the picker
        final Calendar c = Calendar.getInstance();
        int year, month, day;

        if (initialDate != null && !initialDate.isEmpty()) {
            // Parse the initial date to set the date picker
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            try {
                Date date = sdf.parse(initialDate);
                c.setTime(date);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        year = c.get(Calendar.YEAR);
        month = c.get(Calendar.MONTH);
        day = c.get(Calendar.DAY_OF_MONTH);

        // Create a new instance of DatePickerDialog and return it
        return new DatePickerDialog(requireActivity(), this, year, month, day);
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int day) {
        // Do something with the date chosen by the user
        String formattedDate = String.format("%04d-%02d-%02d", year, month + 1, day);
        onDateSetListener.onDateSet(formattedDate);
    }

    public void setOnDateSetListener(OnDateSetListener onDateSetListener) {
        this.onDateSetListener = onDateSetListener;
    }

    public void setInitialDate(String initialDate) {
        this.initialDate = initialDate;
    }
}
