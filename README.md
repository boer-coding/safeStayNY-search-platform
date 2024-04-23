## Work Progress:

### 4.15.2024

athrala- Ying Zhang - implemented Recommendation Page v1

- implemented **route /recommendation**, **RecommendationPage.js**
- 4 Essential filters: Neighborhood group, Neighborhood, Guests, and Stay length. Both Neighborhood group and Neighborhood default to 'Any', and will display the safest and cheapest airbnb listing by querying all listing in NYC. Guests default to 1 and Stay length default to 2.
- 4 Advance filters: Price range, Room type, Beds, and Bathrooms
- Main display has 4 columns for the query based on the filters: Recommeneded Stay, Neighborhood, Safety, and Price.

### 4.16.2024

athrala- Ying Zhang - implemented Recommendation Page v2

- implemented **route /neighborhoods**
- Neighborhood filter based on neighborhood group
- bug fix for 8+ filters and price range 1000+
- bug fix neighborhood_group selected and neighborhood=Any

### 4.17.2024

athrala- Ying Zhang - implemented Recommendation Page v3

- implemented route **/listing**, **ListingCard.js**, **NeighborhoodInfo.js**
- update safety_score to crime_Rate
- add lising card, a pop up page to display comprehensive listing inf
- add main theme color and icon
- edit host page UI

athrala- Ying Zhang - implemented Recommendation Page v4

- implemented route **/feature_listing**
- /recommendation route query optimized
- add 5 feature listings and images on the recommendation page

### 4.22.2024

athrala- Ying Zhang - implemented ListingCard v2

- remove host info, change to comprehensive listing details
