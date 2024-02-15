package com.ttk.tietheknot;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.provider.MediaStore;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class FileUtil {

    public static File from(Context context, Uri uri) throws IOException {
        InputStream inputStream = context.getContentResolver().openInputStream(uri);
        File file = new File(context.getCacheDir(), "temp_image.jpg");
        copyInputStreamToFile(inputStream, file);
        return file;
    }

    private static void copyInputStreamToFile(InputStream inputStream, File file) throws IOException {
        try (OutputStream output = new FileOutputStream(file)) {
            byte[] buffer = new byte[4 * 1024];
            int read;

            while ((read = inputStream.read(buffer)) != -1) {
                output.write(buffer, 0, read);
            }

            output.flush();
        } finally {
            if (inputStream != null) {
                inputStream.close();
            }
        }
    }

    // Additional methods if needed
}
