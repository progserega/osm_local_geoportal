<?

function show_menu($pages, $current = '') {
  echo '<ul>';
  $menu = array();
  foreach  ($pages as $page) {
    if ($page['name'] == 'map') {
      $page['name2'] = '';
    }
    else {
      $page['name2'] = $page['name'];
    }
    $menu[] = ($current == $page['name'] ? '<li id="current" class="main-menu"><span>'.$page['text'].'</span></li>' : '<li class="main-menu"><a href="/'.$page['name2'].'">'.$page['text'].'</a></li>');
  }
  echo implode($menu);
  echo '</ul>';
}

# see http://www.php.net/manual/ru/ref.pgsql.php#89841
function pg_array_parse( $text, &$output, $limit = false, $offset = 1 )
{
  if( false === $limit )
  {
    $limit = strlen( $text )-1;
    $output = array();
  }
  if( '{}' != $text )
    do
    {
      if( '{' != $text{$offset} )
      {
        preg_match( "/(\\{?\"([^\"\\\\]|\\\\.)*\"|[^,{}]+)+([,}]+)/", $text, $match, 0, $offset );
        $offset += strlen( $match[0] );
        $output[] = ( '"' != $match[1]{0} ? $match[1] : stripcslashes( substr( $match[1], 1, -1 ) ) );
        if( '},' == $match[3] ) return $offset;
      }
      else  $offset = pg_array_parse( $text, $output[], $limit, $offset+1 );
    }
    while( $limit > $offset );
  return $output;
}

?>
