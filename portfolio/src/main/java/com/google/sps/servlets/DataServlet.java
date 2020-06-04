// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private ArrayList<String> comments = new ArrayList<String>();
  private DatastoreService datastore;

  @Override
  public void init() {
    comments.add("Wow, this is a great website!");
    comments.add("I enjoyed the pictures that you shared.");
    comments.add("The tech that you use is awesome!");

    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String commentsJson = (new Gson()).toJson(comments);
    response.setContentType("application/json;");
    response.getWriter().println(commentsJson);
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    long timeStamp = System.currentTimeMillis();
    String authorName = request.getParameter("comment-author");
    String commentContent = request.getParameter("comment-input");

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("time", timeStamp);
    commentEntity.setProperty("author", authorName);
    commentEntity.setProperty("content", commentContent);

    datastore.put(commentEntity);

    response.sendRedirect("/");
  }
}
