# Car Finder/Recall Search
The Car Finder app returns a list of car recalls and images by year, make, and model. MVC controller serves up a basic HTML template connected to an AngularJS controller and service. AngularJS sends a request to a ASP.Net Web API controller that returns a car object containing data from three sources:  1.) SQL car database 2.) recall object from NHTSA, and 3.) images from Bing image search.

## Technologies/Resources
AngularJS, ASP.Net Web API, CSS, Bootstrap, NHTSA’s recall API, Azure Cognitive Services/Bing Image Search API, T-SQL stored procedures.

