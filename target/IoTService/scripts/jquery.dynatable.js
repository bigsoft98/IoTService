/*
 * jQuery Dynatable plugin 0.0.3
 *
 * Copyright (c) 2013 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Tue Aug 13 12:50:00 2013 -0500
 */
//

(function($) {
  var defaults,
      mergeSettings,
      dt,
      Model,
      models = {},
      utility,
      build,
      processAll,
      initModel;

  //-----------------------------------------------------------------
  // Cached plugin global defaults
  //-----------------------------------------------------------------

  defaults = {
    features: {
      paginate: true,
      sort: true,
      pushState: true,
      search: true,
      recordCount: true,
      perPageSelect: true
    },
    table: {
      defaultColumnIdStyle: 'camelCase',
      columns: null,
      headRowSelector: 'thead tr', // or e.g. tr:first-child
      bodyRowSelector: 'tbody tr',
      headRowClass: null,
      rowFilter: function(rowIndex, record, columns, cellFilter) {
        var $tr = $('<tr></tr>');

        // grab the record's attribute for each column
        for (var i = 0, len = columns.length; i < len; i++) {
          var column = columns[i],
              html = column.dataFilter(record),
          $td = cellFilter(html);

          if (column.hidden) {
            $td.hide();
          }
          if (column.textAlign) {
            $td.css('text-align', column.textAlign);
          }
          $tr.append($td);
        }

        return $tr;
      },
      cellFilter: function(html) {
        return $('<td></td>', {
          html: html
        });
      }
    },
    inputs: {
      queries: null,
      sorts: null,
      multisort: ['ctrlKey', 'shiftKey', 'metaKey'],
      page: null,
      queryEvent: 'blur change',
      recordCountTarget: null,
      recordCountPlacement: 'after',
      paginationLinkTarget: null,
      paginationLinkPlacement: 'after',
      paginationPrev: 'Previous',
      paginationNext: 'Next',
      paginationGap: [1,2,2,1],
      searchTarget: null,
      searchPlacement: 'before',
      perPageTarget: null,
      perPagePlacement: 'before',
      perPageText: 'Show: ',
      recordCountText: 'Showing ',
      processingText: 'Processing...'
    },
    dataset: {
      ajax: false,
      ajaxUrl: null,
      ajaxCache: null,
      ajaxOnLoad: false,
      ajaxMethod: 'GET',
      ajaxDataType: 'json',
      totalRecordCount: null,
      queries: {},
      queryRecordCount: null,
      page: null,
      perPageDefault: 10,
      perPageOptions: [10,20,50,100],
      sorts: {},
      sortsKeys: null,
      sortTypes: {},
      records: null
    },
    filters: {},
    unfilters: {},
    params: {
      dynatable: 'dynatable',
      queries: 'queries',
      sorts: 'sorts',
      page: 'page',
      perPage: 'perPage',
      offset: 'offset',
      records: 'records',
      record: null,
      queryRecordCount: 'queryRecordCount',
      totalRecordCount: 'totalRecordCount'
    }
  };

  //-----------------------------------------------------------------
  // Each dynatable instance inherits from this,
  // set properties specific to instance
  //-----------------------------------------------------------------

  dt = {
    init: function(element, options) {
      this.settings = mergeSettings(options);
      this.element = element;
      this.$element = $(element);

      // All the setup that doesn't require element or options
      build.call(this);

      return this;
    },

    process: function(skipPushState) {
      processAll.call(this, skipPushState);
    }
  };

  //-----------------------------------------------------------------
  // Cached plugin global functions
  //-----------------------------------------------------------------

  mergeSettings = function(options) {
    var newOptions = $.extend(true, {}, defaults, options);

    // TODO: figure out a better way to do this.
    // Doing `extend(true)` causes any elements that are arrays
    // to merge the default and options arrays instead of overriding the defaults.
    if (options) {
      if (options.inputs) {
        if (options.inputs.multisort) {
          newOptions.inputs.multisort = options.inputs.multisort;
        }
        if (options.inputs.paginationGap) {
          newOptions.inputs.paginationGap = options.inputs.paginationGap;
        }
      }
      if (options.dataset && options.dataset.perPageOptions) {
        newOptions.dataset.perPageOptions = options.dataset.perPageOptions;
      }
    }

    return newOptions;
  };

  build = function() {
    for (model in models) {
      if (models.hasOwnProperty(model)) {
        initModel.call(this, model);
      }
    }

    this.$element.trigger('dynatable:init', this);

    if (!this.settings.dataset.ajax || (this.settings.dataset.ajax && this.settings.dataset.ajaxOnLoad) || this.settings.features.paginate) {
      this.process();
    }
  };

  initModel = function(model) {
    var modelInstance = this[model] = (new models[model]).setInstance(this);
    if (modelInstance.initOnLoad()) {
      modelInstance.init();
    }
  };

  processAll = function(skipPushState) {
    var data = {};

    this.$element.trigger('dynatable:beforeProcess', data);

    if (!$.isEmptyObject(this.settings.dataset.queries)) { data[this.settings.params.queries] = this.settings.dataset.queries; }
    // TODO: Wrap this in a try/rescue block to hide the processing indicator and indicate something went wrong if error
    this.processingIndicator.show();

    if (this.settings.features.sort && !$.isEmptyObject(this.settings.dataset.sorts)) { data[this.settings.params.sorts] = this.settings.dataset.sorts; }
    if (this.settings.features.paginate && this.settings.dataset.page) {
      var page = this.settings.dataset.page,
          perPage = this.settings.dataset.perPage;
      data[this.settings.params.page] = page;
      data[this.settings.params.perPage] = perPage;
      data[this.settings.params.offset] = (page - 1) * perPage;
    }
    if (this.settings.dataset.ajaxData) { $.extend(data, this.settings.dataset.ajaxData); }

    // If ajax, sends query to ajaxUrl with queries and sorts serialized and appended in ajax data
    // otherwise, executes queries and sorts on in-page data
    if (this.settings.dataset.ajax) {
      var _this = this;
      var options = {
        type: _this.settings.dataset.ajaxMethod,
        dataType: _this.settings.dataset.ajaxDataType,
        data: data,
        error: function(xhr, error) {
        },
        success: function(response) {
          _this.$element.trigger('dynatable:ajax:success', response);
          // Merge ajax results and meta-data into dynatables cached data
          _this.records.updateFromJson(response);
          // update table with new records
          _this.dom.update();

          if (_this.settings.features.pushState && !skipPushState && history.pushState) {
            _this.state.push(data);
          }
        },
        complete: function() {
          _this.processingIndicator.hide();
        }
      };
      // Do not pass url to `ajax` options if blank
      if (this.settings.dataset.ajaxUrl) {
        options.url = this.settings.dataset.ajaxUrl;

      // If ajaxUrl is blank, then we're using the current page URL,
      // we need to strip out any query, sort, or page data controlled by dynatable
      // that may have been in URL when page loaded, so that it doesn't conflict with
      // what's passed in with the data ajax parameter
      } else {
        options.url = utility.refreshQueryString(window.location.href, {}, this.settings);
      }
      if (this.settings.dataset.ajaxCache !== null) { options.cache = this.settings.dataset.ajaxCache; }

      $.ajax(options);
    } else {
      this.records.resetOriginal();
      this.queries.run();
      if (this.settings.features.sort) {
        this.records.sort();
      }
      if (this.settings.features.paginate) {
        this.records.paginate();
      }
      this.dom.update();
      this.processingIndicator.hide();

      if (this.settings.features.pushState && !skipPushState && history.pushState) {
        this.state.push(data);
      }
    }
    this.$element.trigger('dynatable:afterProcess', data);
  };

  //-----------------------------------------------------------------
  // Dynatable object model prototype
  // (all object models get these default functions)
  //-----------------------------------------------------------------

  Model = {
    extend: function(props) {
      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          this[prop] = props[prop];
        }
      }
      return this;
    },

    setInstance: function(instance) {
      this.obj = instance;
      return this;
    },

    initOnLoad: function() {
      return true;
    },

    init: function() {}
  };

  //-----------------------------------------------------------------
  // Dynatable object models
  //-----------------------------------------------------------------

  Dom.prototype = Model;
  function Dom() {
    // update table contents with new records array
    // from query (whether ajax or not)
    this.update = function() {
      var _this = this,
          $rows = $(),
          columns = this.obj.settings.table.columns,
          rowFilter = this.obj.settings.table.rowFilter,
          cellFilter = this.obj.settings.table.cellFilter;

      this.obj.$element.trigger('dynatable:beforeUpdate', $rows);

      // loop through records
      for (var i = 0, len = this.obj.settings.dataset.records.length; i < len; i++) {
        var record = this.obj.settings.dataset.records[i],
            $tr = rowFilter(i, record, columns, cellFilter);
        $rows = $rows.add($tr);
      }

      // Appended dynatable interactive elements
      if (this.obj.settings.features.recordCount) {
        $('#dynatable-record-count-' + this.obj.element.id).replaceWith(this.obj.recordsCount.create());
      }
      if (this.obj.settings.features.paginate) {
        $('#dynatable-pagination-links-' + this.obj.element.id).replaceWith(this.obj.paginationLinks.create());
        if (this.obj.settings.features.perPageSelect) {
          $('#dynatable-per-page-' + this.obj.element.id).val(parseInt(this.obj.settings.dataset.perPage));
        }
      }

      // Sort headers functionality
      if (this.obj.settings.features.sort && columns) {
        this.obj.sortsHeaders.removeAllArrows();
        for (var i = 0, len = columns.length; i < len; i++) {
          var column = columns[i],
              sortedByColumn = utility.allMatch(_this.obj.settings.dataset.sorts, column.sorts, function(sorts, sort) { return sort in sorts; }),
              value = _this.obj.settings.dataset.sorts[column.sorts[0]];

          if (sortedByColumn) {
            _this.obj.$element.find('[data-dynatable-column="' + column.id + '"]').find('.dynatable-sort-header').each(function(){
              if (value == 1) {
                _this.obj.sortsHeaders.appendArrowUp($(this));
              } else {
                _this.obj.sortsHeaders.appendArrowDown($(this));
              }
            });
          }
        }
      }

      // Query search functionality
      if (this.obj.settings.inputs.queries) {
        this.obj.settings.inputs.queries.each(function() {
          var $this = $(this),
              q = _this.obj.settings.dataset.queries[$this.data('dynatable-query')];
          $(this).val(q || '');
        });
      }
      this.obj.$element.find(this.obj.settings.table.bodyRowSelector).remove();
      this.obj.$element.append($rows);

      this.obj.$element.trigger('dynatable:afterUpdate', $rows);
    };
  };
  models.dom = Dom;

  DomColumns.prototype = Model;
  function DomColumns() {
    this.initOnLoad = function() {
      return this.obj.$element.is('table');
    };
    this.init = function() {
      this.obj.settings.table.columns = [];
      this.getFromTable();
    };
    // initialize table[columns] array
    this.getFromTable = function() {
      var _this = this,
          $columns = this.obj.$element.find(this.obj.settings.table.headRowSelector).children('th,td');
      if ($columns.length) {
        $columns.each(function(index){
          _this.add($(this), index, true);
        });
      } else {
        return $.error("Couldn't find any columns headers in '" + this.obj.settings.table.headRowSelector + " th,td'. If your header row is different, specify the selector in the table: headRowSelector option.");
      }
    };
    this.add = function($column, position, skipAppend, skipUpdate) {
      var columns = this.obj.settings.table.columns,
          label = $column.text(),
          id = $column.data('dynatable-column') || utility.normalizeText(label, this.obj.settings.table.defaultColumnIdStyle),
          dataSorts = $column.data('dynatable-sorts'),
          sorts = dataSorts ? $.map(dataSorts.split(','), function(text) { return $.trim(text); }) : [id];

      // If the column id is blank, generate an id for it
      if ( !id ) {
        this.generate($column);
        id = $column.data('dynatable-column');
      }
      // Add column data to plugin instance
      columns.splice(position, 0, {
        index: position,
        label: label,
        id: id,
        dataFilter: this.obj.settings.filters[id] || this.defaultFilter,
        dataUnfilter: this.obj.settings.unfilters[id] || this.defaultUnfilter,
        sorts: sorts,
        hidden: $column.css('display') === 'none',
        textAlign: $column.css('text-align')
      });

      // Modify header cell
      $column
        .attr('data-dynatable-column', id)
        .addClass('dynatable-head');
      if (this.obj.settings.table.headRowClass) { $column.addClass(this.obj.settings.table.headRowClass); }

      // Append column header to table
      if (!skipAppend) {
        var domPosition = position + 1,
            $sibling = this.obj.$element.find(this.obj.settings.table.headRowSelector)
              .children('th:nth-child(' + domPosition + '),td:nth-child(' + domPosition + ')').first(),
            columnsAfter = columns.slice(position + 1, columns.length);

        if ($sibling.length) {
          $sibling.before($column);
        // sibling column doesn't yet exist (maybe this is the last column in the header row)
        } else {
          this.obj.$element.find(this.obj.settings.table.headRowSelector).append($column);
        }

        this.obj.sortsHeaders.attachOne($column.get());

        // increment the index of all columns after this one that was just inserted
        if (columnsAfter.length) {
          for (var i = 0, len = columnsAfter.length; i < len; i++) {
            columnsAfter[i].index += 1;
          }
        }

        if (!skipUpdate) {
          this.obj.dom.update();
        }
      }

      return dt;
    };
    this.remove = function(columnIndexOrId) {
      var columns = this.obj.settings.table.columns,
          length = columns.length;

      if (typeof(columnIndexOrId) === "number") {
        var column = columns[columnIndexOrId];
        this.removeFromTable(column.id);
        this.removeFromArray(columnIndexOrId);
      } else {
        // Traverse columns array in reverse order so that subsequent indices
        // don't get messed up when we delete an item from the array in an iteration
        for (var i = columns.length - 1; i >= 0; i--) {
          var column = columns[i];

          if (column.id === columnIndexOrId) {
            this.removeFromTable(columnIndexOrId);
            this.removeFromArray(i);
          }
        }
      }

      this.obj.dom.update();
    };
    this.removeFromTable = function(columnId) {
      this.obj.$element.find(this.obj.settings.table.headRowSelector).children('[data-dynatable-column="' + columnId + '"]').first()
        .remove();
    };
    this.removeFromArray = function(index) {
      var columns = this.obj.settings.table.columns,
          adjustColumns;
      columns.splice(index, 1);
      adjustColumns = columns.slice(index, columns.length);
      for (var i = 0, len = adjustColumns.length; i < len; i++) {
        adjustColumns[i].index -= 1;
      }
    };
    this.defaultFilter = function(record) {
      // `this` is the column object in this.obj.settings.columns
      // TODO: automatically convert common types, such as arrays and objects, to string
      return record[this.id];
    };
    this.defaultUnfilter = function(cell, record) {
      return $(cell).html();
    };
    this.generate = function($cell) {
      var cell = $cell === undefined ? $('<th></th>') : $cell;
      return this.attachGeneratedAttributes(cell);
    };
    this.attachGeneratedAttributes = function($cell) {
      // Use increment to create unique column name that is the same each time the page is reloaded,
      // in order to avoid errors with mismatched attribute names when loading cached `dataset.records` array
      var increment = this.obj.$element.find(this.obj.settings.table.headRowSelector).children('th[data-dynatable-generated]').length;
      return $cell
        .attr('data-dynatable-column', 'dynatable-generated-' + increment) //+ utility.randomHash(),
        .attr('data-dynatable-no-sort', 'true')
        .attr('data-dynatable-generated', increment);
    };
  };
  models.domColumns = DomColumns;

  Records.prototype = Model;
  function Records() {
    this.initOnLoad = function() {
      return !this.obj.settings.dataset.ajax;
    };
    this.init = function() {
      if (this.obj.settings.dataset.records === null) {
        this.obj.settings.dataset.records = this.getFromTable();

        if (!this.obj.settings.dataset.queryRecordCount) {
          this.obj.settings.dataset.queryRecordCount = this.count();
        }

        if (!this.obj.settings.dataset.totalRecordCount){
          this.obj.settings.dataset.totalRecordCount = this.obj.settings.dataset.queryRecordCount;
        }
      }

      // Create cache of original full recordset (unpaginated and unqueried)
      this.obj.settings.dataset.originalRecords = $.extend(true, [], this.obj.settings.dataset.records);
    };
    // merge ajax response json with cached data including
    // meta-data and records
    this.updateFromJson = function(data) {
      var records;
      if (this.obj.settings.params.records === "_root") {
        records = data;
      } else if (this.obj.settings.params.records in data) {
        records = data[this.obj.settings.params.records];
      }
      if (this.obj.settings.params.record) {
        var len = records.length - 1;
        for (var i = 0; i < len; i++) {
          records[i] = records[i][this.obj.settings.params.record];
        }
      }
      if (this.obj.settings.params.queryRecordCount in data) {
        this.obj.settings.dataset.queryRecordCount = data[this.obj.settings.params.queryRecordCount];
      }
      if (this.obj.settings.params.totalRecordCount in data) {
        this.obj.settings.dataset.totalRecordCount = data[this.obj.settings.params.totalRecordCount];
      }
      this.obj.settings.dataset.records = records;
    };
    // For really advanced sorting,
    // see http://james.padolsey.com/javascript/sorting-elements-with-jquery/
    this.sort = function() {
      var _this = this,
          sort = [].sort,
          sorts = this.obj.settings.dataset.sorts,
          sortsKeys = this.obj.settings.dataset.sortsKeys,
          sortTypes = this.obj.settings.dataset.sortTypes;

      var sortFunction = function(a, b) {
        var comparison;
        if ($.isEmptyObject(sorts)) {
          comparison = _this.obj.sorts.functions['originalPlacement'](a, b);
        } else {
          for (var i = 0, len = sortsKeys.length; i < len; i++) {
            var attr = sortsKeys[i],
                direction = sorts[attr],
                sortType = sortTypes[attr] || _this.obj.sorts.guessType(a, b, attr);
            comparison = _this.obj.sorts.functions[sortType](a, b, attr, direction);
            // Don't need to sort any further unless this sort is a tie between a and b,
            // so break the for loop unless tied
            if (comparison !== 0) { break; }
          }
        }
        return comparison;
      }

      return sort.call(this.obj.settings.dataset.records, sortFunction);
    };
    this.paginate = function() {
      var bounds = this.pageBounds(),
          first = bounds[0], last = bounds[1];
      this.obj.settings.dataset.records = this.obj.settings.dataset.records.slice(first, last);
    };
    this.resetOriginal = function() {
      this.obj.settings.dataset.records = this.obj.settings.dataset.originalRecords || [];
    };
    this.pageBounds = function() {
      var page = this.obj.settings.dataset.page || 1,
          first = (page - 1) * this.obj.settings.dataset.perPage,
          last = Math.min(first + this.obj.settings.dataset.perPage, this.obj.settings.dataset.queryRecordCount);
      return [first,last];
    };
    // get initial recordset to populate table
    // if ajax, call ajaxUrl
    // otherwise, initialize from in-table records
    this.getFromTable = function() {
      var _this = this,
          records = [],
          columns = this.obj.settings.table.columns,
          tableRecords = this.obj.$element.find(this.obj.settings.table.bodyRowSelector);

      tableRecords.each(function(index){
        var record = {};
        record['dynatable-original-index'] = index;
        $(this).find('th,td').each(function(index) {
          if (columns[index] === undefined) {
            // Header cell didn't exist for this column, so let's generate and append
            // a new header cell with a randomly generated name (so we can store and
            // retrieve the contents of this column for each record)
            _this.obj.domColumns.add(_this.obj.domColumns.generate(), columns.length, false, true); // don't skipAppend, do skipUpdate
          }
          var value = columns[index].dataUnfilter(this, record),
              attr = columns[index].id;

          // If value from table is HTML, let's get and cache the text equivalent for
          // the default string sorting, since it rarely makes sense for sort headers
          // to sort based on HTML tags.
          if (typeof(value) === "string" && value.match(/\s*\<.+\>/)) {
            if (! record['dynatable-sortable-text']) {
              record['dynatable-sortable-text'] = {};
            }
            record['dynatable-sortable-text'][attr] = $.trim($('<div></div>').html(value).text());
          }

          record[attr] = value;
        });
        // Allow configuration function which alters record based on attributes of
        // table row (e.g. from html5 data- attributes)
        if (typeof(_this.obj.settings.table.rowUnfilter) === "function") {
          _this.obj.settings.table.rowUnfilter(index, this, record);
        }
        records.push(record);
      });
      return records; // 1st row is header
    };
    // count records from table
    this.count = function() {
      return this.obj.settings.dataset.records.length;
    };
  };
  models.records = Records;

  RecordsCount.prototype = Model;
  function RecordsCount() {
    this.initOnLoad = function() {
      return this.obj.settings.features.recordCount;
    };
    this.init = function() {
      this.attach();
    };
    this.create = function() {
      var recordsShown = this.obj.records.count(),
          recordsQueryCount = this.obj.settings.dataset.queryRecordCount,
          recordsTotal = this.obj.settings.dataset.totalRecordCount,
          text = this.obj.settings.inputs.recordCountText,
          collection_name = this.obj.settings.params.records;

      if (recordsShown < recordsQueryCount && this.obj.settings.features.paginate) {
        var bounds = this.obj.records.pageBounds();
        text += "<span class='dynatable-record-bounds'>" + (bounds[0] + 1) + " to " + bounds[1] + "</span> of ";
      } else if (recordsShown === recordsQueryCount && this.obj.settings.features.paginate) {
        text += recordsShown + " of ";
      }
      text += recordsQueryCount + " " + collection_name;
      if (recordsQueryCount < recordsTotal) {
        text += " (filtered from " + recordsTotal + " total records)";
      }

      return $('<span></span>', {
                id: 'dynatable-record-count-' + this.obj.element.id,
                'class': 'dynatable-record-count',
                html: text
              });
    };
    this.attach = function() {
      var $target = this.obj.settings.inputs.recordCountTarget ? $(this.obj.settings.inputs.recordCountTarget) : this.obj.$element;
      $target[this.obj.settings.inputs.recordCountPlacement](this.create());
    };
  };
  models.recordsCount = RecordsCount;

  ProcessingIndicator.prototype = Model;
  function ProcessingIndicator() {
    this.init = function() {
      this.attach();
    };
    this.create = function() {
      var $processing = $('<div></div>', {
            html: '<span>' + this.obj.settings.inputs.processingText + '</span>',
            id: 'dynatable-processing-' + this.obj.element.id,
            'class': 'dynatable-processing',
            style: 'position: absolute; display: none;'
          });

      return $processing;
    };
    this.position = function() {
      var $processing = $('#dynatable-processing-' + this.obj.element.id),
          $span = $processing.children('span'),
          spanHeight = $span.outerHeight(),
          spanWidth = $span.outerWidth(),
          $covered = this.obj.$element,
          offset = $covered.offset(),
          height = $covered.outerHeight(), width = $covered.outerWidth();

      $processing
        .offset({left: offset.left, top: offset.top})
        .width(width)
        .height(height)
      $span
        .offset({left: offset.left + ( (width - spanWidth) / 2 ), top: offset.top + ( (height - spanHeight) / 2 )});

      return $processing;
    };
    this.attach = function() {
      this.obj.$element.before(this.create());
    };
    this.show = function() {
      $('#dynatable-processing-' + this.obj.element.id).show();
      this.position();
    };
    this.hide = function() {
      $('#dynatable-processing-' + this.obj.element.id).hide();
    };
  };
  models.processingIndicator = ProcessingIndicator;

  State.prototype = Model;
  function State() {
    this.initOnLoad = function() {
      // Check if pushState option is true, and if browser supports it
      return this.obj.settings.features.pushState && history.pushState;
    };
    this.init = function() {
      window.onpopstate = function(event) {
        if (event.state && event.state.dynatable) {
          this.pop(event);
        }
      }
    };
    this.push = function(data) {
      var urlString = window.location.search,
          urlOptions,
          newParams,
          cacheStr,
          cache;

      if (urlString && /^\?/.test(urlString)) { urlString = urlString.substring(1); }
      $.extend(urlOptions, data);

      params = utility.refreshQueryString(urlString, data, this.obj.settings);
      this.obj.$element.trigger('dynatable:push', data);

      cache = { dynatable: { dataset: this.obj.settings.dataset } };
      cacheStr = JSON.stringify(cache);

      // Mozilla has a 640k char limit on what can be stored in pushState.
      // See "limit" in https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history#The_pushState().C2.A0method
      // and "dataStr.length" in http://wine.git.sourceforge.net/git/gitweb.cgi?p=wine/wine-gecko;a=patch;h=43a11bdddc5fc1ff102278a120be66a7b90afe28
      //
      // Likewise, other browsers may have varying (undocumented) limits.
      // Also, Firefox's limit can be changed in about:config as browser.history.maxStateObjectSize
      // Since we don't know what the actual limit will be in any given situation, we'll just try caching and rescue
      // any exceptions by retrying pushState without caching the records.
      //
      // I have aboslutely no idea why perPageOptions suddenly becomes an array-like object instead of an array,
      // but just recently, this started throwing an error if I don't convert it:
      // 'Uncaught Error: DATA_CLONE_ERR: DOM Exception 25'
      cache.dynatable.dataset.perPageOptions = $.makeArray(cache.dynatable.dataset.perPageOptions);

      try {
        window.history.pushState(cache, "Dynatable state", '?' + params);
      } catch(error) {
        // Make cached records = null, so that `pop` will rerun process to retrieve records
        cache.dynatable.dataset.records = null;
        window.history.pushState(cache, "Dynatable state", '?' + params);
      }
    };
    this.pop = function(event) {
      var data = event.state.dynatable;
      this.obj.settings.dataset = data.dataset;

      // If dataset.records is cached from pushState
      if ( data.dataset.records ) {
        this.obj.dom.update();
      } else {
        this.obj.process(true);
      }
    };
  };
  models.state = State;

  Sorts.prototype = Model;
  function Sorts() {
    this.initOnLoad = function() {
      return this.obj.settings.features.sort;
    };
    this.init = function() {
      var sortsUrl = window.location.search.match(new RegExp(this.obj.settings.params.sorts + '[^&=]*=[^&]*', 'g'));
      this.obj.settings.dataset.sorts = sortsUrl ? utility.deserialize(sortsUrl)[this.obj.settings.params.sorts] : {};
      this.obj.settings.dataset.sortsKeys = sortsUrl ? utility.keysFromObject(this.obj.settings.dataset.sorts) : [];
    };
    this.add = function(attr, direction) {
      var sortsKeys = this.obj.settings.dataset.sortsKeys,
          index = $.inArray(attr, sortsKeys);
      this.obj.settings.dataset.sorts[attr] = direction;
      if (index === -1) { sortsKeys.push(attr); }
      return dt;
    };
    this.remove = function(attr) {
      var sortsKeys = this.obj.settings.dataset.sortsKeys,
          index = $.inArray(attr, sortsKeys);
      delete this.obj.settings.dataset.sorts[attr];
      if (index !== -1) { sortsKeys.splice(index, 1); }
      return dt;
    };
    this.clear = function() {
      this.obj.settings.dataset.sorts = {};
      this.obj.settings.dataset.sortsKeys.length = 0;
    };
    // Try to intelligently guess which sort function to use
    // based on the type of attribute values.
    // Consider using something more robust than `typeof` (http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/)
    this.guessType = function(a, b, attr) {
      var types = {
            string: 'string',
            number: 'number',
            'boolean': 'number',
            object: 'number' // dates and null values are also objects, this works...
          },
          attrType = a[attr] ? typeof(a[attr]) : typeof(b[attr]),
          type = types[attrType] || 'number';
      return type;
    };
    // Built-in sort functions
    // (the most common use-cases I could think of)
    this.functions = {
      number: function(a, b, attr, direction) {
        return a[attr] === b[attr] ? 0 : (direction > 0 ? a[attr] - b[attr] : b[attr] - a[attr]);
      },
      string: function(a, b, attr, direction) {
        var aAttr = (a['dynatable-sortable-text'] && a['dynatable-sortable-text'][attr]) ? a['dynatable-sortable-text'][attr] : a[attr],
            bAttr = (b['dynatable-sortable-text'] && b['dynatable-sortable-text'][attr]) ? b['dynatable-sortable-text'][attr] : b[attr],
            comparison;
        aAttr = aAttr.toLowerCase();
        bAttr = bAttr.toLowerCase();
        comparison = aAttr === bAttr ? 0 : (direction > 0 ? aAttr > bAttr : bAttr > aAttr);
        // force false boolean value to -1, true to 1, and tie to 0
        return comparison === false ? -1 : (comparison - 0);
      },
      originalPlacement: function(a, b) {
        return a['dynatable-original-index'] - b['dynatable-original-index'];
      }
    };
  };
  models.sorts = Sorts;

  SortsHeaders.prototype = Model;
  // turn table headers into links which add sort to sorts array
  function SortsHeaders() {
    this.initOnLoad = function() {
      return this.obj.settings.features.sort;
    };
    this.init = function() {
      this.attach();
    };
    this.create = function(cell) {
      var _this = this,
          $cell = $(cell),
          $link = $('<a></a>', {
            'class': 'dynatable-sort-header',
            href: '#',
            html: $cell.html()
          }),
          id = $cell.data('dynatable-column'),
          column = utility.findObjectInArray(this.obj.settings.table.columns, {id: id});

      $link.bind('click', function(e) {
        _this.toggleSort(e, $link, column);
        _this.obj.process();

        e.preventDefault();
      });

      if (this.sortedByColumn($link, column)) {
        if (this.sortedByColumnValue(column) == 1) {
          this.appendArrowUp($link);
        } else {
          this.appendArrowDown($link);
        }
      }

      return $link;
    };
    this.attach = function() {
      var _this = this;
      this.obj.$element.find(this.obj.settings.table.headRowSelector).children('th,td').each(function(){
        _this.attachOne(this);
      });
    };
    this.attachOne = function(cell) {
      var $cell = $(cell);
      if (!$cell.data('dynatable-no-sort')) {
        $cell.html(this.create(cell));
      }
    };
    this.appendArrowUp = function($link) {
      this.removeArrow($link);
      $link.append("<span class='dynatable-arrow'> &#9650;</span>");
    };
    this.appendArrowDown = function($link) {
      this.removeArrow($link);
      $link.append("<span class='dynatable-arrow'> &#9660;</span>");
    };
    this.removeArrow = function($link) {
      // Not sure why `parent()` is needed, the arrow should be inside the link from `append()` above
      $link.find('.dynatable-arrow').remove();
    };
    this.removeAllArrows = function() {
      this.obj.$element.find('.dynatable-arrow').remove();
    };
    this.toggleSort = function(e, $link, column) {
      var _this = this,
          sortedByColumn = this.sortedByColumn($link, column),
          value = this.sortedByColumnValue(column);
      // Clear existing sorts unless this is a multisort event
      if (!this.obj.settings.inputs.multisort || !utility.anyMatch(e, this.obj.settings.inputs.multisort, function(evt, key) { return e[key]; })) {
        this.removeAllArrows();
        this.obj.sorts.clear();
      }

      // If sorts for this column are already set
      if (sortedByColumn) {
        // If ascending, then make descending
        if (value == 1) {
          for (var i = 0, len = column.sorts.length; i < len; i++) {
            _this.obj.sorts.add(column.sorts[i], -1);
          }
          this.appendArrowDown($link);
        // If descending, remove sort
        } else {
          for (var i = 0, len = column.sorts.length; i < len; i++) {
            _this.obj.sorts.remove(column.sorts[i]);
          }
          this.removeArrow($link);
        }
      // Otherwise, if not already set, set to ascending
      } else {
        for (var i = 0, len = column.sorts.length; i < len; i++) {
          _this.obj.sorts.add(column.sorts[i], 1);
        }
        this.appendArrowUp($link);
      }
    };
    this.sortedByColumn = function($link, column) {
      return utility.allMatch(this.obj.settings.dataset.sorts, column.sorts, function(sorts, sort) { return sort in sorts; });
    };
    this.sortedByColumnValue = function(column) {
      return this.obj.settings.dataset.sorts[column.sorts[0]];
    };
  };
  models.sortsHeaders = SortsHeaders;

  Queries.prototype = Model;
  function Queries() {
  // For ajax, to add a query, just do
    this.initOnLoad = function() {
      return this.obj.settings.inputs.queries || this.obj.settings.features.search;
    };
    this.init = function() {
      var queriesUrl = window.location.search.match(new RegExp(this.obj.settings.params.queries + '[^&=]*=[^&]*', 'g'));

      this.obj.settings.dataset.queries = queriesUrl ? utility.deserialize(queriesUrl)[this.obj.settings.params.queries] : {};
      if (this.obj.settings.dataset.queries === "") { this.obj.settings.dataset.queries = {}; }

      if (this.obj.settings.inputs.queries) {
        this.setupInputs();
      }
    };
    this.add = function(name, value) {
      // reset to first page since query will change records
      if (this.obj.settings.features.paginate) {
        this.obj.settings.dataset.page = 1;
      }
      this.obj.settings.dataset.queries[name] = value;
      return dt;
    };
    this.remove = function(name) {
      delete this.obj.settings.dataset.queries[name];
      return dt;
    };
    this.run = function() {
      var _this = this;
      for (query in this.obj.settings.dataset.queries) {
        if (_this.obj.settings.dataset.queries.hasOwnProperty(query)) {
          var value = _this.obj.settings.dataset.queries[query];
          if (_this.functions[query] === undefined) {
            // Try to lazily evaluate query from column names if not explictly defined
            var queryColumn = utility.findObjectInArray(_this.obj.settings.table.columns, {id: query});
            if (queryColumn) {
              _this.functions[query] = function(record, queryValue) {
                return record[query] == queryValue;
              };
            } else {
              $.error("Query named '" + query + "' called, but not defined in queries.functions");
              continue; // to skip to next query
            }
          }
          // collect all records that return true for query
          _this.obj.settings.dataset.records = $.map(_this.obj.settings.dataset.records, function(record) {
            return _this.functions[query](record, value) ? record : null;
          });
        }
      }
      this.obj.settings.dataset.queryRecordCount = this.obj.records.count();
    };
    // Shortcut for performing simple query from built-in search
    this.runSearch = function(q) {
      var origQueries = $.extend({}, this.obj.settings.dataset.queries);
      if (q) {
        this.add('search', q);
      } else {
        this.remove('search');
      }
      if (!utility.objectsEqual(this.obj.settings.dataset.queries, origQueries)) {
        this.obj.process();
      }
    };
    this.setupInputs = function() {
      var _this = this;
      this.obj.settings.inputs.queries.each(function() {
        var $this = $(this),
            event = $this.data('dynatable-query-event') || _this.obj.settings.inputs.queryEvent,
            query = $this.data('dynatable-query') || $this.attr('name') || this.id,
            queryFunction = function(e) {
              var q = $(this).val();
              if (q === "") { q = undefined; }
              if (q === _this.obj.settings.dataset.queries[query]) { return false; }
              if (q) {
                _this.add(query, q);
              } else {
                _this.remove(query);
              }
              _this.obj.process();
              e.preventDefault();
            };

        $this
          .attr('data-dynatable-query', query)
          .bind(event, queryFunction)
          .bind('keypress', function(e) {
            if (e.which == 13) {
              queryFunction.call(this, e);
            }
          });

        if (_this.obj.settings.dataset.queries[query]) { $this.val(decodeURIComponent(_this.obj.settings.dataset.queries[query])); }
      });
    };
    // Query functions for in-page querying
    // each function should take a record and a value as input
    // and output true of false as to whether the record is a match or not
    this.functions = {
      search: function(record, queryValue) {
        var contains = false;
        // Loop through each attribute of record
        for (attr in record) {
          if (record.hasOwnProperty(attr)) {
            var attrValue = record[attr];
            if (typeof(attrValue) === "string" && attrValue.toLowerCase().indexOf(queryValue.toLowerCase()) !== -1) {
              contains = true;
              // Don't need to keep searching attributes once found
              break;
            } else {
              continue;
            }
          }
        }
        return contains;
      }
    };
  };
  models.queries = Queries;

  InputsSearch.prototype = Model;
  function InputsSearch() {
    this.initOnLoad = function() {
      return this.obj.settings.features.search;
    };
    this.init = function() {
      this.attach();
    };
    this.create = function() {
      var _this = this,
          $search = $('<input />', {
            type: 'search',
            id: 'dynatable-query-search-' + this.obj.element.id,
            value: this.obj.settings.dataset.queries.search
          }),
          $searchSpan = $('<span></span>', {
            id: 'dynatable-search-' + this.obj.element.id,
            'class': 'dynatable-search',
            text: 'Search: '
          }).append($search);

      $search
        .bind(this.obj.settings.inputs.queryEvent, function() {
          _this.obj.queries.runSearch($(this).val());
        })
        .bind('keypress', function(e) {
          if (e.which == 13) {
            _this.obj.queries.runSearch($(this).val());
            e.preventDefault();
          }
        });
      return $searchSpan;
    };
    this.attach = function() {
      var $target = this.obj.settings.inputs.searchTarget ? $(this.obj.settings.inputs.searchTarget) : this.obj.$element;
      $target[this.obj.settings.inputs.searchPlacement](this.create());
    };
  };
  models.inputsSearch = InputsSearch;

  PaginationPage.prototype = Model;
  function PaginationPage() {
  // provide a public function for selecting page
    this.initOnLoad = function() {
      return this.obj.settings.features.paginate;
    };
    this.init = function() {
      var pageUrl = window.location.search.match(new RegExp(this.obj.settings.params.page + '=([^&]*)'));
      this.set(pageUrl ? pageUrl[1] : 1);
    };
    this.set = function(page) {
      this.obj.settings.dataset.page = parseInt(page, 10);
    }
  };
  models.paginationPage = PaginationPage;

  PaginationPerPage.prototype = Model;
  function PaginationPerPage() {
    this.initOnLoad = function() {
      return this.obj.settings.features.paginate;
    };
    this.init = function() {
      var perPageUrl = window.location.search.match(new RegExp(this.obj.settings.params.perPage + '=([^&]*)'));

      if (perPageUrl) {
        this.set(perPageUrl[1]);
      } else {
        this.set(this.obj.settings.dataset.perPageDefault);
      }

      if (this.obj.settings.features.perPageSelect) {
        this.attach();
      }
    };
    this.create = function() {
      var _this = this,
          $select = $('<select>', {
            id: 'dynatable-per-page-' + this.obj.element.id,
            'class': 'dynatable-per-page-select'
          });

      for (var i = 0, len = this.obj.settings.dataset.perPageOptions.length; i < len; i++) {
        var number = this.obj.settings.dataset.perPageOptions[i],
            selected = _this.obj.settings.dataset.perPage == number ? 'selected="selected"' : '';
        $select.append('<option value="' + number + '" ' + selected + '>' + number + '</option>');
      }

      $select.bind('change', function(e) {
        _this.set($(this).val());
        _this.obj.process();
      });

      return $('<span />', {
        'class': 'dynatable-per-page'
      }).append("<span class='dynatable-per-page-label'>" + this.obj.settings.inputs.perPageText + "</span>").append($select);
    };
    this.attach = function() {
      var $target = this.obj.settings.inputs.perPageTarget ? $(this.obj.settings.inputs.perPageTarget) : this.obj.$element;
      $target[this.obj.settings.inputs.perPagePlacement](this.create());
    };
    this.set = function(number) {
      this.obj.paginationPage.set(1);
      this.obj.settings.dataset.perPage = parseInt(number);
    };
  };
  models.paginationPerPage = PaginationPerPage;

  PaginationLinks.prototype = Model;
  function PaginationLinks() {
  // pagination links which update dataset.page attribute
    this.initOnLoad = function() {
      return this.obj.settings.features.paginate;
    };
    this.init = function() {
      this.attach();
    };
    this.create = function() {
      var _this = this,
          $pageLinks = $('<ul></ul>', {
            id: 'dynatable-pagination-links-' + this.obj.element.id,
            'class': 'dynatable-pagination-links',
            html: '<span>Pages: </span>'
          }),
          pageLinkClass = 'dynatable-page-link',
          activePageClass = 'dynatable-active-page',
          pages = Math.ceil(this.obj.settings.dataset.queryRecordCount / this.obj.settings.dataset.perPage),
          page = this.obj.settings.dataset.page,
          breaks = [
            this.obj.settings.inputs.paginationGap[0],
            this.obj.settings.dataset.page - this.obj.settings.inputs.paginationGap[1],
            this.obj.settings.dataset.page + this.obj.settings.inputs.paginationGap[2],
            (pages + 1) - this.obj.settings.inputs.paginationGap[3]
          ],
          $link;

      for (var i = 1; i <= pages; i++) {
        if ( (i > breaks[0] && i < breaks[1]) || (i > breaks[2] && i < breaks[3])) {
          // skip to next iteration in loop
          continue;
        } else {
          $link = $('<a></a>',{
            html: i,
            'class': pageLinkClass,
            'data-dynatable-page': i
          }).appendTo($pageLinks);

          if (page == i) { $link.addClass(activePageClass); }

          // If i is not between one of the following
          // (1 + (this.obj.settings.paginationGap[0]))
          // (page - this.obj.settings.paginationGap[1])
          // (page + this.obj.settings.paginationGap[2])
          // (pages - this.obj.settings.paginationGap[3])
          var breakIndex = $.inArray(i, breaks),
              nextBreak = breaks[breakIndex + 1];
          if (breakIndex > 0 && i !== 1 && nextBreak && nextBreak > (i + 1)) {
            var $ellip = $('<span class="dynatable-page-break">&hellip;</span>');
            $link = breakIndex < 2 ? $link.before($ellip) : $link.after($ellip);
          }

        }

        if (this.obj.settings.inputs.paginationPrev && i === 1) {
          var $prevLink = $('<a></a>',{
            html: _this.obj.settings.inputs.paginationPrev,
            'class': pageLinkClass + ' dynatable-page-prev',
            'data-dynatable-page': page - 1
          });
          if (page === 1) { $prevLink.addClass(activePageClass); }
          $link = $link.before($prevLink);
        }
        if (_this.obj.settings.inputs.paginationNext && i === pages) {
          var $nextLink = $('<a></a>',{
            html: this.obj.settings.inputs.paginationNext,
            'class': pageLinkClass + ' dynatable-page-next',
            'data-dynatable-page': page + 1
          });
          if (page === pages) { $nextLink.addClass(activePageClass); }
          $link = $link.after($nextLink);
        }
      }

      $pageLinks.children().wrap('<li></li>');

      // only bind page handler to non-active pages
      var selector = '#dynatable-pagination-links-' + this.obj.element.id + ' .' + pageLinkClass + ':not(.' + activePageClass + ')';
      // kill any existing delegated-bindings so they don't stack up
      $(document).undelegate(selector, 'click.dynatable');
      $(document).delegate(selector, 'click.dynatable', function(e) {
        $this = $(this);
        $this.closest('.dynatable-pagination-links').find('.' + activePageClass).removeClass(activePageClass);
        $this.addClass(activePageClass);

        _this.obj.paginationPage.set($this.data('dynatable-page'));
        _this.obj.process();
        e.preventDefault();
      });

      return $pageLinks;
    };
    this.attach = function() {
      // append page liks *after* delegate-event-binding so it doesn't need to
      // find and select all page links to bind event
      var $target = this.obj.settings.inputs.paginationLinkTarget ? $(this.obj.settings.inputs.paginationLinkTarget) : this.obj.$element;
      $target[this.obj.settings.inputs.paginationLinkPlacement](this.obj.paginationLinks.create());
    };
  };
  models.paginationLinks = PaginationLinks;

  utility = {
    normalizeText: function(text, style) {
      text = this.textTransform[style](text);
      return text;
    },
    textTransform: {
      trimDash: function(text) {
        return text.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "-");
      },
      camelCase: function(text) {
        text = this.trimDash(text);
        return text
          .replace(/(\-[a-zA-Z])/g, function($1){return $1.toUpperCase().replace('-','');})
          .replace(/([A-Z])([A-Z]+)/g, function($1,$2,$3){return $2 + $3.toLowerCase();})
          .replace(/^[A-Z]/, function($1){return $1.toLowerCase();});
      },
      dashed: function(text) {
        text = this.trimDash(text);
        return this.lowercase(text);
      },
      underscore: function(text) {
        text = this.trimDash(text);
        return this.lowercase(text.replace(/(-)/g, '_'));
      },
      lowercase: function(text) {
        return text.replace(/([A-Z])/g, function($1){return $1.toLowerCase();});
      }
    },
    // Deserialize params in URL to object
    // see http://stackoverflow.com/questions/1131630/javascript-jquery-param-inverse-function/3401265#3401265
    deserialize: function(query) {
      if (!query) return {};
      // modified to accept an array of partial URL strings
      if (typeof(query) === "object") { query = query.join('&'); }

      var hash = {},
          vars = query.split("&");

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("="),
            k = decodeURIComponent(pair[0]),
            v, m;

        if (!pair[1]) { continue };
        v = decodeURIComponent(pair[1].replace(/\+/g, ' '));

        // modified to parse multi-level parameters (e.g. "hi[there][dude]=whatsup" => hi: {there: {dude: "whatsup"}})
        while (m = k.match(/([^&=]+)\[([^&=]+)\]$/)) {
          var origV = v;
          k = m[1];
          v = {};

          // If nested param ends in '][', then the regex above erroneously included half of a trailing '[]',
          // which indicates the end-value is part of an array
          if (m[2].substr(m[2].length-2) == '][') { // must use substr for IE to understand it
            v[m[2].substr(0,m[2].length-2)] = [origV];
          } else {
            v[m[2]] = origV;
          }
        }

        // If it is the first entry with this name
        if (typeof hash[k] === "undefined") {
          if (k.substr(k.length-2) != '[]') { // not end with []. cannot use negative index as IE doesn't understand it
            hash[k] = v;
          } else {
            hash[k] = [v];
          }
        // If subsequent entry with this name and not array
        } else if (typeof hash[k] === "string") {
          hash[k] = v;  // replace it
        // modified to add support for objects
        } else if (typeof hash[k] === "object") {
          hash[k] = $.extend({}, hash[k], v);
        // If subsequent entry with this name and is array
        } else {
          hash[k].push(v);
        }
      }
      return hash;
    },
    refreshQueryString: function(urlString, data, settings) {
      var _this = this,
          queryString = urlString.split('?'),
          path = queryString.shift(),
          urlOptions;

      urlOptions = this.deserialize(urlString);

      // Loop through each dynatable param and update the URL with it
      for (attr in settings.params) {
        if (settings.params.hasOwnProperty(attr)) {
          var label = settings.params[attr];
          // Skip over parameters matching attributes for disabled features (i.e. leave them untouched),
          // because if the feature is turned off, then parameter name is a coincidence and it's unrelated to dynatable.
          if (
            (!settings.features.sort && attr == "sorts") ||
              (!settings.features.paginate && _this.anyMatch(attr, ["page", "perPage", "offset"], function(attr, param) { return attr == param; }))
          ) {
            continue;
          }

          // Delete page and offset from url params if on page 1 (default)
          if ((attr === "page" || attr === "offset") && data["page"] === 1) {
            if (urlOptions[label]) {
              delete urlOptions[label];
            }
            continue;
          }

          // Delete perPage from url params if default perPage value
          if (attr === "perPage" && data[label] == settings.dataset.perPageDefault) {
            if (urlOptions[label]) {
              delete urlOptions[label];
            }
            continue;
          }

          // For queries, we're going to handle each possible query parameter individually here instead of
          // handling the entire queries object below, since we need to make sure that this is a query controlled by dynatable.
          if (attr == "queries" && data[label]) {
            var queries = settings.inputs.queries || [],
                inputQueries = $.makeArray(queries.map(function() { return $(this).attr('name') }));
            for (var i = 0, len = inputQueries.length; i < len; i++) {
              var attr = inputQueries[i];
              if (data[label][attr]) {
                if (typeof urlOptions[label] === 'undefined') { urlOptions[label] = {}; }
                urlOptions[label][attr] = data[label][attr];
              } else {
                delete urlOptions[label][attr];
              }
            }
            continue;
          }

          // If we havne't returned true by now, then we actually want to update the parameter in the URL
          if (data[label]) {
            urlOptions[label] = data[label];
          } else {
            delete urlOptions[label];
          }
        }
      }
      return decodeURI($.param(urlOptions));
    },
    // Get array of keys from object
    // see http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object/208020#208020
    keysFromObject: function(obj){
      var keys = [];
      for (var key in obj){
        keys.push(key);
      }
      return keys;
    },
    // Find an object in an array of objects by attributes.
    // E.g. find object with {id: 'hi', name: 'there'} in an array of objects
    findObjectInArray: function(array, objectAttr) {
      var _this = this,
          foundObject;
      for (var i = 0, len = array.length; i < len; i++) {
        var item = array[i];
        // For each object in array, test to make sure all attributes in objectAttr match
        if (_this.allMatch(item, objectAttr, function(item, key, value) { return item[key] == value; })) {
          foundObject = item;
          break;
        }
      }
      return foundObject;
    },
    // Return true if supplied test function passes for ALL items in an array
    allMatch: function(item, arrayOrObject, test) {
      // start off with true result by default
      var match = true,
          isArray = $.isArray(arrayOrObject);
      // Loop through all items in array
      $.each(arrayOrObject, function(key, value) {
        var result = isArray ? test(item, value) : test(item, key, value);
        // If a single item tests false, go ahead and break the array by returning false
        // and return false as result,
        // otherwise, continue with next iteration in loop
        // (if we make it through all iterations without overriding match with false,
        // then we can return the true result we started with by default)
        if (!result) { return match = false; }
      });
      return match;
    },
    // Return true if supplied test function passes for ANY items in an array
    anyMatch: function(item, arrayOrObject, test) {
      var match = false,
          isArray = $.isArray(arrayOrObject);

      $.each(arrayOrObject, function(key, value) {
        var result = isArray ? test(item, value) : test(item, key, value);
        if (result) {
          // As soon as a match is found, set match to true, and return false to stop the `$.each` loop
          match = true;
          return false;
        }
      });
      return match;
    },
    // Return true if two objects are equal
    // (i.e. have the same attributes and attribute values)
    objectsEqual: function(a, b) {
      for (attr in a) {
        if (a.hasOwnProperty(attr)) {
          if (!b.hasOwnProperty(attr) || a[attr] !== b[attr]) {
            return false;
          }
        }
      }
      for (attr in b) {
        if (b.hasOwnProperty(attr) && !a.hasOwnProperty(attr)) {
          return false;
        }
      }
      return true;
    },
    // Taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/105074#105074
    randomHash: function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
  };

  //-----------------------------------------------------------------
  // Build the dynatable plugin
  //-----------------------------------------------------------------

  // Object.create support test, and fallback for browsers without it
  if ( typeof Object.create !== "function" ) {
    Object.create = function (o) {
      function F() {}
      F.prototype = o;
      return new F();
    };
  }

  //-----------------------------------------------------------------
  // Global dynatable plugin setting defaults
  //-----------------------------------------------------------------

  $.dynatableSetup = function(options) {
    defaults = mergeSettings(options);
  };

  // Create dynatable plugin based on a defined object
  $.dynatable = function( object ) {
    $.fn['dynatable'] = function( options ) {
      return this.each(function() {
        if ( ! $.data( this, 'dynatable' ) ) {
          $.data( this, 'dynatable', Object.create(object).init(this, options) );
        }
      });
    };
  };

  $.dynatable(dt);

})(jQuery);
