var GiphyQuery;
var GiftApp;

$(document).ready(function () {
    var giphyQuery = {
        apiKey: "1xj4UUqC8qs1tZW1E83gS7gh9GbgZ6zO",
        queryUrl: "http://api.giphy.com/v1/gifs/search",

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
        performSearch: function (searchString, jqOutputContainer) {
            this.sendRequest(searchString, function (response) {
                var data = response.data; // {images: {fixed_height_still, fixed_height}, rating}[]

                data.forEach(function (image) {
                    var element = $("<img>")
                        .attr("src", image.images.fixed_height_still.url)
                        .attr("data-src-still", image.images.fixed_height_still.url)
                        .attr("data-src-anim", image.images.fixed_height.url)
                        .attr("data-state", "still");

                    jqOutputContainer.append(element);
                }, this);
            });
        },
    };
    GiphyQuery = giphyQuery;

    var giftApp = {
        uiImageContainer: $("#image-container"),
        uiButtonContainer: $("#button-container"),
        buttonTexts: ["Corgi", "Husky", "Shiba Inu"],

        init: function () {
            var self = this;
            this.createButtons();
            this.uiButtonContainer.on("click", ".search-button", function () {
                var search = $(this).text();
                giphyQuery.performSearch(search, self.uiImageContainer);
            });
        },

        createButtons: function () {
            this.uiButtonContainer.empty();
            this.buttonTexts.forEach(function (txt) {
                var button = $("<button>").text(txt).addClass("search-button");
                this.uiButtonContainer.append(button);
            }, this);
        },
    };
    GiftApp = giftApp;

    GiftApp.init();
});