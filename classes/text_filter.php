<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
namespace filter_popup;

class text_filter extends \moodle_text_filter {
    /**
     * This only requires execution once per request.
     *
     * @staticvar boolean $jsinitialised
     * @param type $page
     * @param type $context
     */
    public function setup($page, $context) {
        static $jsinitialised = false;
        if (empty($jsinitialised)) {
            $page->requires->yui_module(
                'moodle-filter_popup-popup',
                'M.filter_popup.popup.init'
            );
            $jsinitialised = true;
        }
    }

    /**
     * Filter text.
     *
     * @param type $text
     * @param array $options
     * @return type
     */
    function filter($text, array $options = array()) {
        global $CFG, $PAGE, $COURSE, $DB;

        if (!is_string($text) or empty($text)) {
            // Non string data can not be filtered anyway.
            return $text;
        }

        if (stripos($text, '[popup]') === false) {
            // Performance shortcut - if not [popup] tag, nothing can match.
            return $text;
        }

        $search = '/(\[popup\](.*?)\[\/popup\])/is';

        $result = preg_replace_callback($search, [$this, 'filter_popup_impl'], $text);

        if (is_null($result)) {
            return $text; // Error during regex processing (too many nested spans?).
        } else {
            return $result;
        }
    }

    /**
     * Change markup to actual popup.
     *
     * @param type $text
     * @return type
     */
    function filter_popup_impl($text) {
        $title = '';
        $content = '';

        if (preg_match('/\[poptitle\](.*?)\[\/poptitle\]/', $text[2], $element_title) > 0) {
            if (!empty($element_title[1])) {
                $title = $element_title[1];
                $content = str_replace('[poptitle]'.$title.'[/poptitle]', '', $text[2]);
                // Replace <p> with <br><br>.
                //$content = str_replace('<p>', '', $content);
                //$content = str_replace('</p>', '<br><br>', $content);
                $content = str_replace('&nbsp;', '', $content);
                $content = htmlspecialchars($content);

            }
        }
        return '<span id="popup-'.$title.'" class="popup-tool"><a href="#" class="popup-trigger" onclick="return false;" title="'.$title.'">'.$title.'</a><span id="popup-content-'.$title.'" class="popup-content">'.$content.'</span></span>';
    }
}

