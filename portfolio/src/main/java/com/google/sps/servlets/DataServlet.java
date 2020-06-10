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
import com.google.sps.data.Comment;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private DatastoreService datastore;
  private UserService userService;

  @Override
  public void init() {
    datastore = DatastoreServiceFactory.getDatastoreService();
    userService = UserServiceFactory.getUserService();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    ArrayList<Comment> comments = new ArrayList<Comment>();
    int countOfComments = Integer.parseInt(request.getParameter("comment-count"));
    Query queryAllComments = new Query("Comment").addSort("time", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(queryAllComments);

    for (Entity comment : results.asIterable()) {
      String commentContent = (String) comment.getProperty("content");
      
      comments.add(new Comment(
        comment.getKey().getId(),
        (long) comment.getProperty("time"),
        (String) comment.getProperty("author"),
        (String) comment.getProperty("email"),
        (String) comment.getProperty("content")
      ));
    }

    // Prevent comment count to be over the total number of comments
    if (countOfComments > comments.size()) countOfComments = comments.size();
    
    String commentsJson = (new Gson()).toJson(comments.subList(0, countOfComments));
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
    commentEntity.setProperty("email", userService.getCurrentUser().getEmail());

    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }
}
