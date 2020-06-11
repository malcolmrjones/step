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
import java.util.Scanner;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.sps.data.TropicalStorm;

@WebServlet("/tropical-storm-data")
public class TropicalStormDataServlet extends HttpServlet {

  private ArrayList<TropicalStorm> tropicalStormData;
  
  @Override
  public void init() {
    tropicalStormData = new ArrayList<TropicalStorm>();

    Scanner scanner = new Scanner(getServletContext()
      .getResourceAsStream("/WEB-INF/tropical_storm_landfall_past_3_years.csv"));
    
      while (scanner.hasNextLine()) {
        String line = scanner.nextLine();
        String[] info = line.split(",");

        String ID = info[0];
        int season = Integer.parseInt(info[1]);
        String name = info[2];
        String date = info[3];
        double lat = Double.parseDouble(info[4]);
        double lon = Double.parseDouble(info[5]);

        tropicalStormData.add(new TropicalStorm(ID, season, name, date, lat, lon));
    }
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    Scanner scanner = new Scanner(getServletContext()
      .getResourceAsStream("/WEB-INF/tropical-storm-data-past-3-years-grouped.json"));
    
      while (scanner.hasNextLine()) {
        response.getWriter().println(scanner.nextLine());
      }
  
  
  }

}
