var GiphyQuery;
var GiftApp;

$(document).ready(function () {
    var giphyQuery = {
        apiKey: "1xj4UUqC8qs1tZW1E83gS7gh9GbgZ6zO",
        queryUrl: "https://api.giphy.com/v1/gifs/search",

        /** Sends an AJAX request and calls the callback function with a response */
        sendRequest: function (searchString, callback) {
            var queryParameters = {
                "q": searchString,
                "limit": "10",
                // "rating": "g pg",
                "api_key": this.apiKey,
            }

            var url = this.queryUrl + "?" + $.param(queryParameters);

            $.ajax({
                url: url,
                type: "GET",
            }).done(callback);
        },

        /** Begins an AJAX request and populates the specified container with the results when the request completes */
        performSearch: function (searchString, jqOutputContainer, imgConstructor) {
            this.sendRequest(searchString, function (response) {
                var data = response.data; // {images: {fixed_height_still, fixed_height}, rating}[]

                jqOutputContainer.empty(); 

                data.forEach(function (image) {
                    var element = imgConstructor(
                        image.images.fixed_height_still.url,  
                        image.images.fixed_height.url,
                        image.rating);
                    jqOutputContainer.prepend(element);
                }, this);
            });
        },
    };
    GiphyQuery = giphyQuery;

    var giftApp = {
        uiImageContainer: $("#image-container"),
        uiButtonContainer: $("#button-container"),
        uiNewThingBox: $("#new-thing-box"),
        uiAddThingButton: $("#add-thing"),
        topics: ["Corgi", "Husky", "Shiba Inu"],

        init: function () {
            var self = this;
            this.createButtons();
            this.uiButtonContainer.on("click", ".search-button", function () {
                var search = $(this).text();
                giphyQuery.performSearch(search, self.uiImageContainer, self.imgConstructor);
            });

            this.uiImageContainer.on("click", ".result-image", function() {
                var img = $(this);
                var state = img.attr("data-state");
                var still = state == "still";

                img.attr("data-state", still ? "anim" : "still");
                img.attr("src", still ? img.attr("data-src-anim"): img.attr("data-src-still"));
            });

            this.uiAddThingButton.click(function(e) {
                e.preventDefault();
                var text = self.uiNewThingBox.val();
                self.uiNewThingBox.val("");
                self.topics.push(text);
                self.createButtons();
            });          
        },

        createButtons: function () {
            this.uiButtonContainer.empty();
            this.topics.forEach(function (txt) {
                var button = $("<button>").text(txt).addClass("search-button btn mx-1");
                this.uiButtonContainer.append(button);
            }, this);
        },

        imgConstructor: function(stillUrl, animUrl, rating){
            var img = $("<img>")
                .attr("src", stillUrl)
                .attr("data-src-still", stillUrl)
                .attr("data-src-anim", animUrl)
                .attr("data-state", "still")
                .addClass("result-image card-image-top img-fluid");

            var rating = $("<div>").addClass("card-header").text("Rating: " + rating.toUpperCase());
            
            var card = $("<div>").addClass("card my-1 align-top");
            card.append(rating).append(img);

            var cardContainer = $("<div>").addClass("col-6 col-md-4 col-lg-3 card-container").append(card);
            return cardContainer;

        },
    };
    GiftApp = giftApp;

    GiftApp.init();
});