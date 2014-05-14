YUI.add('moodle-filter_popup-popup', function(Y) {
    // Define a name space to call
    M.filter_popup = M.filter_popup || {};
    M.filter_popup.popup = {
        init: function() { 
            //Convert <br><br> to <p>text</p>
            var ConvertToParagraphs = function(content) {
                var lineBreaksRemoved = content.replace(/\n/g, "");
                var wrappedInParagraphs = "<p>" + lineBreaksRemoved + "</p>";
                var brsRemoved = wrappedInParagraphs.replace(/<br[^>]*>[\s]*<br[^>]*>/gi, "</p>\n<p>");
                var emptyParagraphsRemoved = brsRemoved.replace(/<p><\/p>/g, "");
                return emptyParagraphsRemoved;
            };
            var handlePopup = function(e) {
                var title = e.currentTarget.get('textContent');
                var content = ConvertToParagraphs(e.currentTarget.get('nextSibling').get('innerHTML'));
                //Dialog for popups
                var dialog = new Y.Panel({
                    id : 'popup-dialog-panel',
                    headerContent : title,
                    bodyContent: content,
                    zIndex     : 5,
                    centered   : true,
                    modal      : true, // modal behavior
                    render     : true,
                    visible    : false, // make visible explicitly with .show()
                    /*buttons    : {
                        footer: [
                            {
                                name     : 'proceed',
                                label    : 'OK',
                                action   : 'onOK'
                            }
                        ]
                    }*/
                });
                /*dialog.onOK = function (e) {
                    e.preventDefault();                    
                    this.hide();
                    this.callback = false;
                };*/
                dialog.after('visibleChange', function (e) {
                    if (!e.newVal) { // panel is hidden
                      this.destroy();
                    }
                });
                dialog.show();
            };
            Y.delegate('click',handlePopup, document, '.popup-trigger');
        }
    };
}, '1.0', {
    requires: ['node']
});