#!/usr/bin/env perl
use utf8;
use strict;
use warnings;
use File::Slurp 'slurp';
use File::Path 'make_path';
use Text::MultiMarkdown 'markdown';
use autodie;
use Encode;
use Text::Handlebars;
use Unicode::Normalize qw/NFD NFC/;
use List::MoreUtils 'uniq';

my $outdir = 'generated';
my $base = $ENV{BASE_URL} or die "missing BASE_URL";
my $site = $ENV{SITE_NAME} or die "missing SITE_NAME";
my $site_title = $ENV{SITE_TITLE} or die "missing SITE_TITLE";
my $feed_title = $ENV{FEED_TITLE} or die 'Shawn M Moore';

make_path $outdir unless -d $outdir;

my %layout = (
    en => scalar(slurp 'layout.en.html'),
);

my @months = qw/
    Nulluary January February March April May June July
    August September October November December
/;

my $css_sha;

sub prettify_date {
    my $date = shift;

    my ($y, $m, $d) = split '-', $date;
    $d =~ s/^0//;

    return "$months[$m] $d, $y";
}

sub read_content_md {
    my $file = shift;
    my $content = slurp $file;

    my $headers;
    $headers .= $1 while $content =~ s/^(@?\w+: .+\n)//;

    my $md = markdown($content);

    # ugh
    $md =~ s{<\s*p\s*>\s*<\s*figure}{<figure}gi;
    $md =~ s{<\s*/\s*figure\s*>\s*<\s*/\s*p\s*>}{</figure>}gi;

    $md =~ s{<a }{<a target="_blank" }g;

    return $headers . $md;
}

sub read_content {
    my $file = shift;

    my ($ext) = $file =~ /\.(\w+)$/;

    my $reader = __PACKAGE__->can("read_content_$ext")
        or die "Unable to handle file type $ext for $file";

    return $reader->($file);
}

sub new_article {
    my $content = shift;
    my $file    = shift;

    my %headers;
    while ($content =~ s/^(@?)(\w+): (.+)\n//) {
      my ($array, $header, $value) = ($1, $2, $3);
      if ($array) {
        push @{ $headers{$header} }, $value;
      }
      else {
        $headers{$header} = $value;
      }
    }

    $headers{original} = $content;

    if (!$headers{date}) {
        warn "No date for $headers{title}!" if !$headers{draft};
        my (undef,undef,undef,$day,$mon,$year) = localtime((stat($file))[9]);
        $mon++;
        $year += 1900;
        $headers{date} = "$year-$mon-$day";
    }

    my $date = prettify_date($headers{date});

    my $wrapper = qq[
        <header>
            <span id="date">$date</span>
            <h1 id="title">$headers{title}</h1>
    ];

    if ($headers{subtitle}) {
      $wrapper .= qq[
            <h2 id="subtitle">$headers{subtitle}</h2>
      ];
    }

    $wrapper .= qq[
        </header>
        <article>
            $content
        </article>
    ];

    $content = $wrapper;

    if ($headers{cover}) {
        $content = qq[
        <img id="cover" src="$headers{cover}">
        $content
        ];
    }

    $headers{content} = $content;

    return \%headers;
}

my $hbs = Text::Handlebars->new(
    helpers => {
        now => sub { scalar gmtime },
    },
);

sub fill_in {
    my $template = shift;
    my $vars     = shift;

    $vars->{rss} ||= '/rss.xml';
    $vars->{css_sha} ||= $css_sha
        or die "No CSS sha yet??";
    $vars->{site_title} ||= $site_title;

    return $hbs->render_string($template, $vars);
}

sub titleify {
    my $orig = shift;
    my $title = lc $orig;
    $title =~ s/<.*?>//g;
    $title =~ s/'s\b/s/g;
    $title =~ s/\W+/-/g;
    $title =~ s/^-//;
    $title =~ s/-$//;

    return lc($orig) if $title eq '';
    return $title;
}

sub date_dir {
    my $date = shift;
    $date =~ s[^(\d{4})-(\d{2})-\d{2}][$1/$2/]
        or die "Invalid date: $date";
    return $date;
}

sub generate_css {
    my $output = `sha1sum static/style.css`;
    ($css_sha) = $output =~ /^(\w+) /;
    die "Can't extract CSS sha from: $output" if !$css_sha;

    system("cp -r static/style.css $outdir/$css_sha.css");
}

generate_css();

my %articles;

while (my $file = glob("published/* writing/*")) {
    my $content = read_content($file);
    my $article = new_article($content, $file);
    next if $article->{skip};

    if ($article->{draft}) {
        $article->{dir} = 'drafts/';
    }
    else {
        $article->{dir} = date_dir($article->{date});
    }

    $article->{basename} ||= titleify($article->{title});
    $article->{file} = $article->{dir} . $article->{basename} . '.html';
    $article->{url} = $article->{external} || "/$article->{file}";

    push @{ $articles{ $article->{date} } }, $article;
}

my @articles = map { @{ $articles{$_} } } reverse sort keys %articles;
sub each_article (&) {
    my $code = shift;

    my @articles = grep { !$_->{draft} } @articles;
    $code->($_) for @articles;
}

each_article {
    my $article = shift;
    generate_article($article);
};

generate_index();
generate_drafts();
generate_rss();
generate_static();

sub generate_article {
    my $article = shift;

    $article->{content} = qq[
        <div id="post">
            $article->{content}
        </div>
    ];

    $article->{title_tag} = $article->{title};
    $article->{title_tag} =~ s/<.*?>//g;
    $article->{title_tag} .= " - $site";
    my $html = fill_in($layout{en}, $article);

    make_path "$outdir/$article->{dir}";

    for my $file (uniq(NFD($article->{file}), NFC($article->{file}))) {
        open my $handle, '>', "$outdir/$article->{file}";
        print $handle $html;
    }
}

sub generate_index {
    my $posts;
    my $new_year;

    each_article {
        my $article = shift;

        return if $article->{noindex};

        my $date = prettify_date($article->{date});
        my $sigil = $article->{external} ? ' <span class="external">⤴</span> ' : "";
        my $li_class = "";

        my ($year) = $article->{date} =~ /^(\d\d\d\d)-/;
        if (!defined($new_year) || $year != $new_year) {
            $li_class .= " new-year";
        }
        $new_year = $year;

        my $title = $article->{title};
        if ($article->{subtitle}) {
          $title .= qq[ <span class="subtitle">($article->{subtitle})</span>];
        }

        $posts .= qq[<li class="$li_class">
    <span class="year">$year</span>
    <span class="date">$date</span>
    <span class="title"><a href="$article->{url}">$title</a>$sigil</span>
</li>];
    };

    $posts = qq[<ul id="posts">$posts</ul>];

    my $file = "$outdir/index.html";

    open my $handle, '>', $file;
    print $handle encode_utf8(fill_in($layout{en}, {
        content     => $posts,
        title       => $title,
        title_tag   => $site,
        description => "The personal blog of Shawn M Moore, covering software engineering, game development, linguistics, productivity, learning, and more.",
        index       => 1,
    }));
}

sub generate_drafts {
    my $posts = '';
    for my $article (grep { $_->{draft} } @articles) {
        generate_article($article);

        next if $article->{noindex};

        my $date = prettify_date($article->{date});
        my $title = $article->{title};
        if ($article->{subtitle}) {
          $title .= qq[ <span class="subtitle">($article->{subtitle})</span>];
        }

        $posts .= qq[<li>
    <span class="date">$date</span>
    <span class="title"><a href="$article->{url}">$title</a></span>
</li>];
    };

    $posts = qq[<ul id="posts">$posts</ul>];

    open my $handle, '>', "$outdir/drafts/index.html";
    print $handle fill_in($layout{en}, {
        content   => $posts,
        title     => $title,
        title_tag => $site,
    });
}

sub generate_rss {
    require XML::RSS;

    my $feed = XML::RSS->new(version => '2.0');
    $feed->channel(
        title => $title,
        link  => $base,
    );

    my @articles;

    each_article {
        my $article = shift;
        return if $article->{noindex};
        push @articles, $article;
    };

    @articles = sort { $b->{date} cmp $a->{date} } @articles;
    splice @articles, 10;

    for my $article (@articles) {
        my $title = $article->{title} || $article->{name};
        if ($article->{subtitle}) {
          $title .= " ($article->{subtitle})";
        }

        my $description = decode_utf8($article->{original} || $article->{description});
        $description =~ s!\bloading…!(This bit of content likely won't show up in your reader, please visit the <a href="$article->{url}">article</a> in your browser.)!g;

        $feed->add_item(
            title       => decode_utf8($title),
            link        => $article->{url},
            description => $description,
            permaLink   => $article->{url},
            dc          => {
                date    => $article->{date},
                author  => 'Shawn M Moore',
            },
        );
    };

    $feed->save("$outdir/rss.xml");
}

sub generate_static {
    system("cp -r static/* $outdir/");
}
