YUI.add('moodle-filter_popup-popup', function(Y) {
    // Define a name space to call.
    M.filter_popup = M.filter_popup || {};
    M.filter_popup.popup = {
        init: function() { 
            // Convert <br><br> to <p>text</p>.
            var ConvertToParagraphs = function(content) {
                //var lineBreaksRemoved = content.replace(/\n/g, "");
                var replacespace = content.replace(/&nbsp;/g, "");
                var replacelt = content.replace(/&lt;/g, "<");
                var replacegt = replacelt.replace(/&gt;/g, ">");
                //var wrappedInParagraphs = "<p>" + replacegt + "</p>";
                //var brsRemoved = wrappedInParagraphs.replace(/<br[^>]*>[\s]*<br[^>]*>/gi, "</p>\n<p>");
                //var emptyParagraphsRemoved = brsRemoved.replace(/<p><\/p>/g, "");
                return replacegt;
            };
            var handlePopup = function(e) {
                var title = e.currentTarget.get('textContent');
                var content = ConvertToParagraphs(e.currentTarget.get('nextSibling').get('innerHTML'));
                // Dialog for popups.
                var dialog = new Y.Panel({
                    id : 'popup-dialog-panel',
                    headerContent : title,
                    bodyContent: content,
                    zIndex     : 5,
                    centered   : true,
                    modal      : true,
                    render     : true,
                    visible    : false,
                });
                dialog.after('visibleChange', function (e) {
                    // Panel is hidden.
                    if (!e.newVal) {
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