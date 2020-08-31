# Software Requirements
----------

### Vision
#### What is the vision of this product?
Create a clean looking app that simplifies the movie selection process.

#### What pain point does this project solve?
There are too many movies to watch and so many choices. This app makes it easy for a user to pick a movie.

#### Why should we care about your product?
Everyone has trouble making decisions on what to watch because there are so many movie streaming services out there. 
You should care about this product because it will save time and cut out the stress of searching for a movie to watch

------
### Scope (In/Out)
#### IN - What will your product do?
* User can create a username to access recommended movie list and create personalized watchlist
* User will be able to click on “Add watchlist” to add movie from list of recommendations
* User will be able to view watchlist a separate page
* User will be able to sort watchlist and remove movies

#### OUT 
* This site will never allow users to enter password or store password information
* User will have no way of sharing their watchlist with others

_____

### Minimum Viable Product 
#### What will your MVP functionality be? 
* Displaying recommendations based on rating allowing movies to be added and removed from watchlist
* Hitting API of OMDb to retrieve data (title, poster and description) 
* Creating and storing usernames in database
* We will have 4 pages (login/recommended movies page, watchlist page, details page, and about us page)


### What are your stretch goals?
* Hitting Unofficial Netflix API to show whether movies are also on Netflix
* Having a link to movie trailer
* Able to make profiles and have a profiles page

### Stretch
#### What stretch goals are you going to aim for? 
* Hitting Unofficial Netflix API to show whether movies are also on Netflix
* Having a link to movie trailer
* Able to make profiles and have a profiles page

### Functional Requirements
#### The functionality of your product consists of the following tasks:
* User can create a username to access recommended movie list and create personalized watchlist
* User will be able to click on “Add watchlist” to add movie from list of recommendations
* User will be able to view watchlist a separate page
* User will be able to sort  by watchlist and remove movies

### Data Flow
* The user will arrive at the recommendations page where they can login by entering their username. 
* Here they will also see a list of movie recommendations listed by rating. 
* The user can click on a movie to see movie details on a movie details page or just one to the watchlist.
* Once the movie is added to watchlist, the user will be taken to watchlist page where they can sort movies by genre. 
* Additionally, the user can view the “About Us” page so they can learn details about creators of this site. 

### Non-Functional Requirements (301 & 401 only)
**Availability:**
* The site will be available for a year at all hours. 
* After a one year period our custom domain will need to be renewed. 
* At this point, the site will not be accessible to the public unless renewed.

**Usability:** 
* Navigation is straightforward on our site. 
* All of our buttons are clearly labeled and the interface is clean so that the user can navigate through the site easily. 
