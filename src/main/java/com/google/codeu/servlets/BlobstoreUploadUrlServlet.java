package com.google.codeu.servlets;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/blobstore-upload-url")
public class BlobstoreUploadUrlServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // get the parameter type from the get request
        // return the url according to the parameter

        String type = request.getParameter("type");
        if (type.equals("message")){
            BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
            String uploadUrl = blobstoreService.createUploadUrl("/messages") ;
            response.setContentType("text/html");
            response.getOutputStream().println(uploadUrl);
        }
        else if(type.equals("aboutme")){
            BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
            String uploadUrl = blobstoreService.createUploadUrl("/about") ;
            response.setContentType("text/html");
            response.getOutputStream().println(uploadUrl);
        }
        else{
            return;
        }
    }
}