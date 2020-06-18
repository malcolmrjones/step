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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    if(request.getDuration() > TimeRange.WHOLE_DAY.duration()) return new ArrayList<TimeRange>();

    ArrayList<TimeRange> availableTimes = new ArrayList<TimeRange>();
    availableTimes.add(TimeRange.WHOLE_DAY);

    for(Event event : events) {

      boolean eventHasMeetingAttendee = false;
      for(String eventAttendee : event.getAttendees()) {
        if(request.getAttendees().contains(eventAttendee)) {
          eventHasMeetingAttendee = true;
          break;
        }
      }
      if(!eventHasMeetingAttendee) continue;

      TimeRange eventTime = event.getWhen();
      for(int i = 0; i < availableTimes.size(); i++) {
        // if contains else if overlap
        TimeRange currentAvailableTime = availableTimes.get(i);
        if(availableTimes.get(i).contains(eventTime)) {
          //break up interval into two
          TimeRange splitLower = TimeRange.fromStartEnd(currentAvailableTime.start(), eventTime.start(), false);
          TimeRange splitUpper = TimeRange.fromStartEnd(eventTime.end(), currentAvailableTime.end(), false);
          availableTimes.remove(i);
          if(splitUpper.duration() >= request.getDuration()) availableTimes.add(i, splitUpper);
          if(splitLower.duration() >= request.getDuration()) availableTimes.add(i, splitLower);
        }
        else if(availableTimes.get(i).overlaps(eventTime)) {
          // check starts and ends and split apppropriately
          if(eventTime.start() < currentAvailableTime.start()) {
            TimeRange modifiedAvailableTime = TimeRange.fromStartEnd(eventTime.end(), currentAvailableTime.end(), false);
            if(modifiedAvailableTime.duration() >= request.getDuration()) {
              availableTimes.set(i, modifiedAvailableTime);
            }
            else {
              availableTimes.remove(i);
            }
          }
          else if(eventTime.start() > currentAvailableTime.start()) {
            TimeRange modifiedAvailableTime = TimeRange.fromStartEnd(currentAvailableTime.start(), eventTime.start(), false);
            if(modifiedAvailableTime.duration() >= request.getDuration()) {
              availableTimes.set(i, modifiedAvailableTime);
            }
            else {
              availableTimes.remove(i);
            }
          }
        }
      }
    }

    return availableTimes;
    
  }
}
