# todolist-with-json-server
Issues I encountered:
-Changing sides button  bug -> duplicates, most likely due to my state function. I'm spreading the same todo array but I need to filter it out based on whether the complete status is true/false. Confused about how I should've separated pending/complete status, maybe a new state

-Edit button: similar issue as above. Was not sure how to update state so got stuck here because I was getting duplicates. If I had time, I would have implemented the toggling by adding/removing a "editableContent" attribute depending if it was in the matching span.

CSS - Would have done if more time
