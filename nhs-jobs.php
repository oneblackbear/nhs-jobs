<?php
/**
 * Plugin Name: NHS Jobs
 * Plugin URI: http://nhstna.oneblackbear.com/vacancies/
 * Description: NHS Jobs plugin. Pulls jobs from nhsjobs and shows them in a nice listing.
 * Version: 1.0
 * Author: Oneblackbear
 * Author URI: https://www.oneblackbear.com
 */


function _fetchVacancies()
{
    $feedUrl = urldecode($_POST['feed']);

    //cache the feed in transient cache
    $hash = md5($feedUrl);
    if ( false === ( $raw_recruitment = get_transient( $hash ) ) ) {
        $raw_recruitment = wp_remote_retrieve_body(wp_remote_get($feedUrl, ['timeout' => 60]));
        set_transient( $hash, $raw_recruitment, HOUR_IN_SECONDS );
    }

    return json_decode(json_encode(simplexml_load_string($raw_recruitment)));
}

function fetchVacancies()
{
    $vacancies = _fetchVacancies();
    wp_send_json($vacancies);
}
add_action( 'wp_ajax_fetchVacancies', 'fetchVacancies' );
add_action( 'wp_ajax_nopriv_fetchVacancies', 'fetchVacancies' );


//[nhsjobfeed]
function nhsjobfeed_shortcode( $atts, $content = null )
{
    $url = admin_url("admin-ajax.php");
    $nonce = wp_create_nonce();

    $file = json_decode(file_get_contents(plugins_url( 'dist/manifest.json', __FILE__ )), true);
    wp_enqueue_script( 'nhsjobfeedjs', plugins_url( 'dist/' . $file['vacancyFeed.js'], __FILE__ ) );
    $feed = html_entity_decode($atts['url']);
    $feed = urlencode($feed);

    return <<<EOT
    <div id='nhs-feed' class='loading'></div>
    <script>
        window.FEED = {
            url: '$url',
            action: 'fetchVacancies',
            nonce: '$nonce',
            feed: '$feed',
        };
    </script>
    EOT;
}
add_shortcode( 'nhsjobfeed', 'nhsjobfeed_shortcode' );
