'use strict';

const http = new XMLHttpRequest();

var yumRepo = 'https://repo.fortisoar.fortinet.com/';
var basePath = 'https://fortisoar.contenthub.fortinet.com/';
var listItems = [];
var listItemsBkp;
var showContentTypeClearFilter = false;
var showCategoryClearFilter = false;
var showPublisherClearFilter = false;
var clearAllFilter = false;
var paramContentType = getUrlParameter('contentType');
var searchContent = getUrlParameter('searchContent');
var paramCategory = getUrlParameter('category');
var paramPublisher = getUrlParameter('publisher');
var categoryList = [];
var publisherList = [];
var contentTypeList = [{ 'name': 'Connectors', 'value': 'connector' }, { 'name': 'Solution Packs', 'value': 'solutionpack' }, { 'name': 'Widgets', 'value': 'widget' }];

$(document).ready(function () {
  var navBar = document.getElementById('sidebar');
  if (navBar) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", basePath + "assets/html/sidebar.html", false); // false for synchronous request
    xmlHttp.send(null);
    navBar.innerHTML = xmlHttp.responseText;

    if (!localStorage.hasOwnProperty('allFiltersJson')) {
      xmlHttp.open("GET", yumRepo + "content-hub/content-hub-filters.json", false); // false for synchronous request
      xmlHttp.send(null);
      var allFilterJsonResponse = xmlHttp.responseText;
      localStorage.setItem('allFiltersJson', allFilterJsonResponse);
    }
    var allFiltersJson = localStorage.getItem('allFiltersJson');
    allFiltersJson = JSON.parse(allFiltersJson);
    
    categoryList = allFiltersJson.category;
    publisherList = allFiltersJson.publisher;
    setTimeout(function () {
      if (window.location.href.indexOf('connect.html') > -1) {
        $("#lets_connect_link").addClass("d-none");
      } else {
        $("#lets_connect_link").removeClass("d-none");
      }
      if (searchContent) {
        $("#searchText").val(searchContent);
      }
      if ($(window).width() <= 450) {
        $('.sidebar').addClass('d-none');
        $('.mobile-view-filter-btn').removeClass('d-none');
      }
      buildFilterList('contentType');
      buildFilterList('category');
      buildFilterList('publisher');
    }, 1000);
  }
  var footer = $('#footer-container');
  if (footer) {
    footer.load('assets/html/footer.html');
  }
  if ($(window).width() <= 450) {
    $('#searchText').removeAttr('placeholder');
  }
  $('.dropdown-toggle').dropdown();
  $('.nav-tabs').tab();
});

function reloadURLParams(){
  paramContentType = getUrlParameter('contentType');
  searchContent = getUrlParameter('searchContent');
  paramCategory = getUrlParameter('category');
  paramPublisher = getUrlParameter('publisher');
}

function buildFilterList(type, filter, match) {
  reloadURLParams();
  if (type === 'category') {
    var categoryListUl = $("#filter-category-list");
    categoryListUl.html('');
    var paramCategoryArray = paramCategory ? paramCategory.split(',') : [];
    _.each(categoryList, function (category) {

      var selectedCategory = _.find(paramCategoryArray, function (catItem) {
        return catItem === category;
      });
      var categoryLi = document.createElement('li');
      var matchFound = false;
      if(filter){
        matchFound = category.toLowerCase().indexOf(match.toLowerCase()) > -1;
        categoryLi.className = matchFound ? "sidebar-item list-unstyled fw-light" : "sidebar-item list-unstyled fw-light d-none";
      } else {
        categoryLi.className = "sidebar-item list-unstyled fw-light";
      }
      
      var categoryInput = document.createElement('input');
      categoryInput.className = "sidebar-link";
      categoryInput.setAttribute("type", "checkbox");
      categoryInput.setAttribute("value", category);
      if (selectedCategory) {
        categoryInput.setAttribute("checked", true);
        showCategoryClearFilter = true;
      }
      categoryInput.addEventListener("click", function () {
        applyFilter(this, category, 'category');
      });
      categoryLi.appendChild(categoryInput);

      var categoryText = document.createTextNode(category);
      categoryLi.appendChild(categoryText);

      categoryListUl.append(categoryLi);
    });
  } else if (type === 'publisher') {
    var publisherListUl = $("#filter-publisher-list");
    publisherListUl.html('');
    var paramPublisherArray = paramPublisher ? paramPublisher.split(',') : [];
    _.each(publisherList, function (publisher) {
      var selectedPublisher = _.find(paramPublisherArray, function (publisherItem) {
        return publisherItem === publisher;
      });
      var publisherLi = document.createElement('li');
      var matchFound = false;
      if(filter){
        matchFound = publisher.toLowerCase().indexOf(match.toLowerCase()) > -1;
        publisherLi.className = matchFound ? "sidebar-item list-unstyled fw-light" : "sidebar-item list-unstyled fw-light d-none";
      } else {
        publisherLi.className = "sidebar-item list-unstyled fw-light";
      }

      var publisherInput = document.createElement('input');
      publisherInput.className = "sidebar-link";
      publisherInput.setAttribute("type", "checkbox");
      publisherInput.setAttribute("value", publisher);
      if (selectedPublisher) {
        publisherInput.setAttribute("checked", true);
        showPublisherClearFilter = true;
      }
      publisherInput.addEventListener("click", function () {
        applyFilter(this, publisher, 'publisher');
      });
      publisherLi.appendChild(publisherInput);

      var publisherText = document.createTextNode(publisher);
      publisherLi.appendChild(publisherText);

      publisherListUl.append(publisherLi);
    });
  } else if (type === 'contentType') {
    var contentTypeListUl = $("#filter-contenttype-list");
    contentTypeListUl.html('');
    var paramContentTypeArray = paramContentType ? paramContentType.split(',') : [];
    _.each(contentTypeList, function (contentType) {
      var selectedContentType = _.find(paramContentTypeArray, function (contentTypeItem) {
        return contentTypeItem === contentType.value;
      });
      var contentTypeLi = document.createElement('li');
      var matchFound = false;
      if(filter){
        matchFound = contentType.name.toLowerCase().indexOf(match.toLowerCase()) > -1;
        contentTypeLi.className = matchFound ? "sidebar-item list-unstyled fw-light" : "sidebar-item list-unstyled fw-light d-none";
      } else {
        contentTypeLi.className = "sidebar-item list-unstyled fw-light";
      }

      var contentTypeInput = document.createElement('input');
      contentTypeInput.className = "sidebar-link";
      contentTypeInput.setAttribute("type", "checkbox");
      contentTypeInput.setAttribute("value", contentType.value);
      if (selectedContentType) {
        contentTypeInput.setAttribute("checked", true);
        showContentTypeClearFilter = true;
      }
      contentTypeInput.addEventListener("click", function () {
        applyFilter(this, contentType.value, 'contentType');
      });
      contentTypeLi.appendChild(contentTypeInput);

      var contentTypeText = document.createTextNode(contentType.name);
      contentTypeLi.appendChild(contentTypeText);

      contentTypeListUl.append(contentTypeLi);
    });
  }
  updateFilterButtons();
}

function updateFilterButtons() {
  clearAllFilter = false;
  if (showContentTypeClearFilter || showCategoryClearFilter || showPublisherClearFilter) {
    clearAllFilter = true;
  }
  var clearAllBtn = $("#clear-all-filter-btn");
  var clearContentTypeBtn = $("#clear-contenttype-filter-btn");
  var clearCategoryBtn = $("#clear-category-filter-btn");
  var clearPublisherBtn = $("#clear-publisher-filter-btn");
  var navBar = document.getElementById('sidebar');
  if (navBar) {
    !clearAllFilter ? clearAllBtn.addClass("d-none") : clearAllBtn.removeClass("d-none");
    !showContentTypeClearFilter ? clearContentTypeBtn.addClass("d-none") : clearContentTypeBtn.removeClass("d-none");
    !showCategoryClearFilter ? clearCategoryBtn.addClass("d-none") : clearCategoryBtn.removeClass("d-none");
    !showPublisherClearFilter ? clearPublisherBtn.addClass("d-none") : clearPublisherBtn.removeClass("d-none");
  }
}

function clearFilter(type) {
  reloadURLParams();
  var appendFilterToURL = "/list.html";
  if (type == 'contentType') {
    appendFilterToURL = "?contentType=all";
    if (paramCategory) {
      appendFilterToURL += "&category=" + paramCategory;
    }
    if (paramPublisher) {
      appendFilterToURL += "&publisher=" + paramPublisher;
    }
    showContentTypeClearFilter = false;
    resetAllCheckboxes($('#filter-contenttype-list input'));
  } else if (type == 'category') {
    if (paramContentType) {
      appendFilterToURL = "?contentType=" + paramContentType;
    } else {
      appendFilterToURL = "?contentType=all";
    }
    if (paramPublisher) {
      appendFilterToURL += "&publisher=" + paramPublisher;
    }
    showCategoryClearFilter = false;
    resetAllCheckboxes($('#filter-category-list input'));
  } else if (type == 'publisher') {
    if (paramContentType) {
      appendFilterToURL = "?contentType=" + paramContentType;
    } else {
      appendFilterToURL = "?contentType=all";
    }
    if (paramCategory) {
      appendFilterToURL += "&category=" + paramCategory;
    }
    showPublisherClearFilter = false;
    resetAllCheckboxes($('#filter-publisher-list input'));
  } else if (type == 'all') {
    appendFilterToURL = "?contentType=all";
    showContentTypeClearFilter = false;
    showCategoryClearFilter = false;
    showPublisherClearFilter = false;
    clearAllFilter = false;
    resetAllCheckboxes($('.sidebar-item input'));
  }
  window.history.replaceState(null, null, appendFilterToURL);
  updateFilterButtons();
  filterContentByParams(paramContentType, paramCategory, paramPublisher);
}

function resetAllCheckboxes(checkboxes){
  if(checkboxes && checkboxes.length > 0){
    _.each(checkboxes, function(checkbox){
      if(checkbox.checked){
        checkbox.click();
      }
    });
  } else {
    if(checkboxes.checked){
      checkboxes.click();
    }
  }
}

function init() {
  var contentHubPath = yumRepo + "content-hub/content-hub-web.json";
  var allItemsJson;
  //Check headers last modified date
  httpGetHeaderInfo(contentHubPath, function(lastModifiedDate) {
    if (!localStorage.hasOwnProperty('allItemsJsonlastModifiedDate')) {
      localStorage.setItem('allItemsJsonlastModifiedDate', lastModifiedDate);
    }
    var allItemsJsonlastModifiedDate = localStorage.getItem('allItemsJsonlastModifiedDate');
    
    if(localStorage.hasOwnProperty('allItemsJson')) {
      allItemsJson = localStorage.getItem('allItemsJson');
      allItemsJson = JSON.parse(allItemsJson);
    }
    
    if(allItemsJsonlastModifiedDate === lastModifiedDate && allItemsJson && allItemsJson.length > 0){
      updateContentOnPageLoad(allItemsJson);
    } else {
      localStorage.setItem('allItemsJsonlastModifiedDate', lastModifiedDate);
      var httpLoadContent = new XMLHttpRequest();
      httpLoadContent.open("GET", contentHubPath, false); // false for synchronous request
      httpLoadContent.send(null);
      var allItemsJsonResponse = httpLoadContent.responseText;
      localStorage.setItem('allItemsJson', allItemsJsonResponse);
      allItemsJson = localStorage.getItem('allItemsJson');
      allItemsJson = JSON.parse(allItemsJson);
      updateContentOnPageLoad(allItemsJson);
    }
  });
}

function updateContentOnPageLoad(allItemsJson){
  var updatesList = [];
  var updatesCount = 0;
  _.each(allItemsJson, function (item) {
    var today = new Date();
    var priorDate = new Date(new Date().setDate(today.getDate() - 30));
    var last30DaysTimeStamp = Math.floor(priorDate.getTime() / 1000);
    if (item.publishedDate >= last30DaysTimeStamp && updatesCount < 10) {
      updatesList.push(item);
      updatesCount = updatesCount + 1;
    }
  });
  var totalItems = allItemsJson.length;
  listItems = allItemsJson;
  listItemsBkp = listItems;
  if (window.location.href.indexOf('list.html') === -1) {
    getContentCount(listItemsBkp);
    setTimeout(function () {
      buildUpdatesAvailableList(updatesList);
    }, 100);
    buildHomePageBanners();
  }
  if (paramContentType && !searchContent) {
    setTimeout(function () {
      filterContentByParams(paramContentType, paramCategory, paramPublisher);
    }, 1000);
  } else if (window.location.href.indexOf('list.html') > -1 && searchContent) {
    searchContentData(searchContent);
  } else {
    filterContent('all', true);
  }
  $("#totalContentCount").html(totalItems);
  
  var mainPageLoader = $('.main-loader');
  if (mainPageLoader) {
    setTimeout(function () {
      $('.main-page-content').removeClass('d-none');
      mainPageLoader.addClass('d-none');
    }, 1200);
    $('#carouselExampleCaptions').carousel({ interval: 5000 });
    $('#carouselProductUpdates').carousel({ interval: 10000 });
  }
  
  setTimeout(function () {
    if (window.location.href.indexOf('list.html') > -1) {
      $('.list-loading').addClass('d-none');
      $('.all-list-content').removeClass('d-none');
    }
  }, 1000);
}

var initLoad = window.location.href.indexOf('connect.html') > -1 || window.location.href.indexOf('detail.html') > -1;

if (!initLoad) {
  init();
}

function getContentCount(listData) {
  var solutionPackCount = 0;
  var connectorCount = 0;
  var widgetCount = 0;
  var reportCount = 0;
  var dashboardCount = 0;
  var howToVideosCount = 0;
  var playbookCount = 0;
  _.each(listData, function (listItem) {
    if (listItem.type === 'solutionpack') {
      solutionPackCount = solutionPackCount + 1;
    } else if (listItem.type === 'widget') {
      widgetCount = widgetCount + 1;
    } else if (listItem.type === 'connector') {
      connectorCount = connectorCount + 1;
    } else if (listItem.type === 'dashboard') {
      dashboardCount = dashboardCount + 1;
    } else if (listItem.type === 'report') {
      reportCount = reportCount + 1;
    } else if (listItem.type === 'how_to_videos') {
      howToVideosCount = howToVideosCount + 1;
    } else if (listItem.type === 'playbook') {
      playbookCount = playbookCount + 1;
    }
  });

  setTimeout(function () {
    document.getElementById("solutionpack_category_count").innerHTML = solutionPackCount;
    document.getElementById("widget_category_count").innerHTML = widgetCount;
    document.getElementById("connector_category_count").innerHTML = connectorCount;
  }, 1000);
}

function applyFilter(item, value, filterType) {
  reloadURLParams();
  var contentTypeParams;
  var categoryParams;
  var publisherParams;

  if (item.checked || item.className === 'category-link') {
    if (filterType === 'contentType') {
      contentTypeParams = updateFilterParams(paramContentType, value, 'add', 'contentType');
      categoryParams = paramCategory;
      publisherParams = paramPublisher;
      showContentTypeClearFilter = true;
    } else if (filterType === 'category') {
      contentTypeParams = paramContentType;
      categoryParams = updateFilterParams(paramCategory, value, 'add', 'category');
      publisherParams = paramPublisher;
      showCategoryClearFilter = true;
    } else if (filterType === 'publisher') {
      contentTypeParams = paramContentType;
      categoryParams = paramCategory;
      publisherParams = updateFilterParams(paramPublisher, value, 'add', 'publisher');
      showPublisherClearFilter = true;
    }
  } else {
    if (filterType === 'contentType') {
      contentTypeParams = updateFilterParams(paramContentType, value, 'remove', 'contentType');
      categoryParams = paramCategory;
      publisherParams = paramPublisher;
    } else if (filterType === 'category') {
      contentTypeParams = paramContentType;
      categoryParams = updateFilterParams(paramCategory, value, 'remove', 'category');
      publisherParams = paramPublisher;
    } else if (filterType === 'publisher') {
      contentTypeParams = paramContentType;
      categoryParams = paramCategory;
      publisherParams = updateFilterParams(paramPublisher, value, 'remove', 'publisher');
    }
  }

  if (window.location.href.indexOf('list.html') === -1) {
    window.location.href = "/list.html?contentType=" + contentTypeParams;
  } else {
    var appendFilterToURL = "/list.html?contentType=" + contentTypeParams;
    if (categoryParams) {
      appendFilterToURL += "&category=" + categoryParams;
    }
    if (publisherParams) {
      appendFilterToURL += "&publisher=" + publisherParams;
    }
    window.history.replaceState(null, null, appendFilterToURL);
  }
  updateFilterButtons();
  filterContentByParams(contentTypeParams, categoryParams, publisherParams);
}

function updateFilterParams(data, item, method, type) {
  if ((data === 'all' || data === null) && method !== 'remove') {
    data = item;
  } else {
    var dataArray = data.split(',');
    var index = dataArray.indexOf(item);
    if (method === 'add' && index === -1) {
      data = data + ',' + item;
    } else if (method === 'remove') {
      if (index > -1) {
        dataArray.splice(index, 1);
      }
      var defaultValue = type === 'contentType' ? 'all' : null;
      data = dataArray.length > 0 ? dataArray.join(',') : defaultValue;
    }
  }
  return data;
}

function submitSearchFilter(event, type){
  var match = event.value;
  buildFilterList(type, true, match);
}

function filterContentByParams() {
  reloadURLParams();
  var filteredListItems = [];
  if (paramContentType || paramCategory || paramPublisher) {
    var contentTypeFilter = paramContentType.split(',');
    var categoryFilter = paramCategory ? paramCategory.split(',') : [];
    var publisherFilter = paramPublisher ? paramPublisher.split(',') : [];
    _.each(listItems, function (item) {
      _.each(contentTypeFilter, function (type) {
        if (item.type === type || type === 'all') {
          if (categoryFilter.length > 0 || publisherFilter.length > 0) {
            if (categoryFilter.length > 0) {
              _.each(categoryFilter, function (category) {
                if (item.category === category || item.category.indexOf(category) > -1) {
                  if (publisherFilter.length > 0) {
                    _.each(publisherFilter, function (publisher) {
                      if (item.publisher === publisher) {
                        filteredListItems.push(item);
                      }
                    });
                  } else {
                    filteredListItems.push(item);
                  }
                }
              });
            } else {
              _.each(publisherFilter, function (publisher) {
                if (item.publisher === publisher) {
                  filteredListItems.push(item);
                }
              });
            }
          } else {
            filteredListItems.push(item);
          }
        }
      });
    });
    $("#totalContentCount").html(filteredListItems.length);
  } else {
    filteredListItems = listItemsBkp;
    $("#totalContentCount").html(filteredListItems.length);
  }
  buildListData(filteredListItems);
}

function filterContent(types, latest) {
  var filteredListItems = [];
  if (types !== 'all') {
    types = types.split(',');
    _.each(listItems, function (item) {
      _.each(types, function (type) {
        if (item.type === type) {
          filteredListItems.push(item);
        }
      });
    });
    $("#totalContentCount").html(filteredListItems.length);
  } else if (latest) {
    var todaysDate = new Date();
    todaysDate = todaysDate.getTime();

    _.each(listItems, function (item, index) {
      var time_difference = todaysDate - (item.published_date * 1000);
      time_difference = time_difference / (1000 * 60 * 60 * 24);
      if (time_difference > 0 && time_difference <= 15) {
        filteredListItems.push(item);
      }
    });
  } else {
    filteredListItems = listItemsBkp;
    $("#totalContentCount").html(filteredListItems.length);
  }
  buildListData(filteredListItems);
}

function submitSearch() {
  var searchText = $("#searchText").val();
  var searchAlertBox = $(".custom-search-alert");
  if (searchText.length >= 3 || searchText.length === 0) {
    var searchParams = searchText.length >= 3 ? "&searchContent=" + searchText : "";
    if (window.location.href.indexOf('list.html') === -1 && searchText.length >= 3) {
      window.location.href = "/list.html?contentType=all" + searchParams;
    } else if (window.location.href.indexOf('list.html') > -1) {
      window.history.replaceState(null, null, "/list.html?contentType=all" + searchParams);
      searchContentData(searchText);
    }
    searchAlertBox.removeClass("show");
  } else {
    searchAlertBox.addClass("show");
  }
}

function dismissSearchAlertBox() {
  $(".custom-search-alert").removeClass('show');
}

function searchContentData(match) {
  reloadURLParams();
  var searchedListItems = [];
  _.each(listItems, function (item) {
    if (paramContentType && paramContentType !== 'all') {
      if (paramContentType === item.type && (item.name.toLowerCase().indexOf(match.toLowerCase()) > -1 || item.label.toLowerCase().indexOf(match.toLowerCase()) > -1)) {
        searchedListItems.push(item);
      }
    } else {
      if (item.name.toLowerCase().indexOf(match.toLowerCase()) > -1|| item.label.toLowerCase().indexOf(match.toLowerCase()) > -1) {
        searchedListItems.push(item);
      }
    }
  });

  $("#totalContentCount").html(searchedListItems.length);
  buildListData(searchedListItems);
}

function buildHomePageBanners() {
  var mainBanner = $("#main-carousel-content");
  var updatesBanner = $("#carousel-product-updates-content");
  var mainBannerIndicator = $("#main-carousel-indicators");
  var bannersJson = $.getJSON({ 'url': "assets/banners.json", 'async': false });
  bannersJson = JSON.parse(bannersJson.responseText);

  //Main Banner
  _.each(bannersJson.mainBanner, function (banner, index) {
    var carouselIndicatorButton = document.createElement('button');
    carouselIndicatorButton.className = index === 0 ? "active" : "";
    var carouselId = "carouselMainCaptions" + index;
    carouselIndicatorButton.setAttribute("type", "button");
    carouselIndicatorButton.setAttribute("data-bs-target", "#carouselExampleCaptions");
    carouselIndicatorButton.setAttribute("data-bs-slide-to", index);
    carouselIndicatorButton.setAttribute("aria-label", banner.heading);

    mainBannerIndicator.append(carouselIndicatorButton);

    var carouselDiv = document.createElement('div');
    carouselDiv.className = index === 0 ? "carousel-item active" : "carousel-item";
    carouselDiv.style.backgroundImage = "url(" + basePath + banner.imagePath + ")";

    var carouselContainer = document.createElement('div');
    carouselContainer.className = "custom-left-offset-1 custom-right-offset-1";
    carouselDiv.appendChild(carouselContainer);

    var carouselRow = document.createElement('div');
    carouselRow.className = "row";
    carouselRow.setAttribute("id", carouselId);
    carouselContainer.appendChild(carouselRow);

    var carouselColumn = document.createElement('div');
    carouselColumn.className = "col-auto carousel-col";
    carouselRow.appendChild(carouselColumn);

    var carouselHeading = document.createElement('h1');
    carouselHeading.className = banner.backgroundColorType;
    carouselColumn.appendChild(carouselHeading);

    var carouselHeadingText = document.createTextNode(banner.heading);
    carouselHeading.appendChild(carouselHeadingText);

    var carouselSubHeading = document.createElement('p');
    carouselSubHeading.className = banner.backgroundColorType;
    carouselColumn.appendChild(carouselSubHeading);

    var carouselSubHeadingText = document.createTextNode(banner.subHeading);
    carouselSubHeading.appendChild(carouselSubHeadingText);

    var carouselHyperLink = document.createElement('a');
    carouselHyperLink.href = banner.hyperLink;
    carouselHyperLink.className = "pull-left text-center btn btn-md";
    carouselHyperLink.setAttribute("target", "_blank");
    carouselHyperLink.setAttribute("rel", "canonical");
    var carouselHyperLinkText = document.createTextNode(banner.hyperLinkText);
    carouselHyperLink.appendChild(carouselHyperLinkText);
    carouselColumn.appendChild(carouselHyperLink);

    mainBanner.append(carouselDiv);
  });

  //Updates banner
  _.each(bannersJson.updatesBanner, function (updateBanner, index) {

    var carouselDiv = document.createElement('div');
    carouselDiv.className = index === 0 ? "carousel-item active" : "carousel-item";

    var carouselRow = document.createElement('div');
    carouselRow.className = "row";
    carouselDiv.appendChild(carouselRow);

    var carouselColumn = document.createElement('div');
    carouselColumn.className = "col-auto carousel-col";
    carouselRow.appendChild(carouselColumn);

    var itemIconDiv = document.createElement('span');
    itemIconDiv.className = "d-inline-block item-image";
    itemIconDiv.style.backgroundImage = "url(" + updateBanner.imagePath + ")";
    carouselColumn.appendChild(itemIconDiv);

    var carouselContent = document.createElement('div');
    carouselContent.className = "d-inline-block";

    var carouselHeading = document.createElement('h3');
    carouselContent.appendChild(carouselHeading);

    var carouselHeadingText = document.createTextNode(updateBanner.heading);
    carouselHeading.appendChild(carouselHeadingText);

    var carouselSubHeading = document.createElement('p');
    carouselContent.appendChild(carouselSubHeading);

    var carouselSubHeadingText = document.createTextNode(updateBanner.subHeading);
    carouselSubHeading.appendChild(carouselSubHeadingText);

    var carouselHyperLink = document.createElement('a');
    carouselHyperLink.href = updateBanner.hyperLink;
    carouselHyperLink.className = "pull-left text-center btn-link";
    carouselHyperLink.setAttribute("target", "_blank");
    carouselHyperLink.setAttribute("rel", "canonical");
    var carouselHyperLinkText = document.createTextNode(updateBanner.hyperLinkText);
    carouselHyperLink.appendChild(carouselHyperLinkText);
    carouselContent.appendChild(carouselHyperLink);

    carouselColumn.appendChild(carouselContent);

    updatesBanner.append(carouselDiv);
  });
}

function buildUpdatesAvailableList(listData) {
  var marketPlaceUpdates = $("#latest-hub-updates");
  _.each(listData, function (listItem) {
    var mpCard = buildCardHtml(listItem);

    var itemButton = document.createElement('span');
    itemButton.className = "btn p-0 btn-link text-decoration-none";
    var itemButtonText = document.createTextNode("Learn More");
    itemButton.appendChild(itemButtonText);
    mpCard.appendChild(itemButton);

    marketPlaceUpdates.append(mpCard);
  });
}

function buildListData(listData) {
  var marketPlace = $("#marketplace-list");
  var contentCountElement = $("#content-count");
  marketPlace.html('');
  $(".mp-tile-container").remove();
  $("#filteredContentCount").html(listData.length);
  if(listData.length === 0){
    var noResultDiv = document.createElement('div');
    noResultDiv.className = "fs h-100 m-5 mp-content-no-results text-center";
    var noResultTitle = document.createElement('h4');
    noResultTitle.className = "mp-tile-title";
    var noResultText = document.createTextNode('No Results Found');
    noResultTitle.appendChild(noResultText);
    noResultDiv.appendChild(noResultTitle);
    marketPlace.append(noResultDiv);
    contentCountElement.addClass('d-none');
  } else {
    contentCountElement.removeClass('d-none');
  }
  _.each(listData, function (listItem) {
    var mpCard = buildCardHtml(listItem);
    marketPlace.append(mpCard);
  });
}

function buildCardHtml(listItem) {
  var aTaglistItem = document.createElement('a');
  var entityName = encodeURIComponent(listItem.name);
  aTaglistItem.href = basePath + "detail.html?entity=" + entityName + "&version=" + listItem.version + "&type=" + listItem.type;
  aTaglistItem.className = "mp-tile-container mp-tile-" + listItem.type + "-container";
  aTaglistItem.setAttribute("title", listItem.label);

  var itemIconSpan = document.createElement('span');
  itemIconSpan.className = "mp-content-type-icon pull-left";
  var itemIcon = document.createElement('i');
  itemIcon.className = "icon-" + listItem.type + "-type icon";
  itemIconSpan.appendChild(itemIcon);
  aTaglistItem.appendChild(itemIconSpan);

  var itemType = document.createElement('p');
  itemType.className = "mp-content-type d-inline-block";
  var itemTypeText = document.createTextNode(listItem.type === 'solutionpack' ? 'Solution Pack' : listItem.type);
  itemType.appendChild(itemTypeText);
  aTaglistItem.appendChild(itemType);

  var itemContentDiv = document.createElement('div');
  itemContentDiv.className = "mp-content-fixed-height";

  var itemTitle = document.createElement('h4');
  itemTitle.className = "mp-tile-title";
  var itemTitleText = document.createTextNode(listItem.label || listItem.display);
  itemTitle.appendChild(itemTitleText);
  itemContentDiv.appendChild(itemTitle);

  var itemDetailsDiv = document.createElement('div');
  itemDetailsDiv.className = "mp-tile-details";

  var itemVersion = document.createElement('p');
  itemVersion.className = "m-0";
  var itemVersionTag = document.createElement('span');
  itemVersionTag.className = "text-black-50";
  var itemVersionTagText = document.createTextNode("Version: ");
  itemVersionTag.appendChild(itemVersionTagText);
  itemVersion.appendChild(itemVersionTag);
  var itemVersionText = document.createTextNode(listItem.version);
  itemVersion.appendChild(itemVersionText);
  itemDetailsDiv.appendChild(itemVersion);

  if(listItem.publisher){
    var itemPublisher = document.createElement('p');
    itemPublisher.className = "m-0";
    var itemPublisherTag = document.createElement('span');
    itemPublisherTag.className = "text-black-50";
    var itemPublisherTagText = document.createTextNode("Published By: ");
    itemPublisherTag.appendChild(itemPublisherTagText);
    itemPublisher.appendChild(itemPublisherTag);
    var itemPublisherText = document.createTextNode(listItem.publisher);
    itemPublisher.appendChild(itemPublisherText);
    itemDetailsDiv.appendChild(itemPublisher);
  }
  
  itemContentDiv.appendChild(itemDetailsDiv);
  aTaglistItem.appendChild(itemContentDiv);

  var itemIconDiv = document.createElement('div');
  itemIconDiv.className = "mp-tile-image-container";

  var imageElement;
  if (listItem.iconLarge) {
    imageElement = document.createElement('img');
    imageElement.className = "mp-tile-image";
    imageElement.src = yumRepo + listItem.iconLarge;
    imageElement.setAttribute("width", "85");
    imageElement.setAttribute("height", "auto");
    imageElement.setAttribute("loading", "lazy");
  } else {
    imageElement = document.createElement('i');
    imageElement.className = "mp-tile-icon icon-" + listItem.type + "-large";
  }

  itemIconDiv.appendChild(imageElement);
  aTaglistItem.appendChild(itemIconDiv);

  var cardDescription = document.createElement('p');
  cardDescription.className = "card-description mp-tile-description muted-80"; //remove card-description class
  listItem.description = listItem.description ? listItem.description : 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';
  var itemDescription = document.createTextNode(listItem.description.substring(0, 110) + '...');
  cardDescription.appendChild(itemDescription);
  aTaglistItem.appendChild(cardDescription);
  return aTaglistItem;
}

function toggleFilter(e) {
  var event = $(e);
  if (event.hasClass('active')) {
    event.removeClass('active');
    $('.sidebar').addClass('d-none');
  } else {
    event.addClass('active');
    $('.sidebar').removeClass('d-none');
  }
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return null;
};

function httpGetHeaderInfo(theUrl, callback){
  http.open('HEAD', theUrl);
  http.onreadystatechange = function() { 
      if (http.readyState == 4 && http.status == 200) {
        var lastModifiedDate = http.getResponseHeader("Last-Modified");
        callback(lastModifiedDate);
      }
  }
  http.send();
};
