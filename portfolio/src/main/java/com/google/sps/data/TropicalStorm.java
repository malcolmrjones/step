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

package com.google.sps.data;

/** This class represents landfall data of a tropical storm */
public class TropicalStorm {

  private final String ID;
  private final int season;
  private final String name;
  private final String date;
  private final double lat;
  private final double lng;

  public TropicalStorm(String ID, int season, String name, String date, double lat, double lng) {
    this.ID = ID;
    this.season = season;
    this.name = name;
    this.date = date;
    this.lat = lat;
    this.lng = lng;
  }
  
}
