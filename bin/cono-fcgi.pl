#!/usr/bin/env perl 

use strict;
use warnings;

use CGI::Easy::Headers;
use CGI::Easy::Request;
use CGI::Easy::Session;
use FCGI;
use File::Spec;
use FindBin qw($Bin);
use JSON qw(encode_json);
use Socket;
use List::Util qw(any);

my $sock = FCGI::OpenSocket('127.0.0.1:11112', SOMAXCONN);
my $request = FCGI::Request(\*STDIN, \*STDOUT, \*STDERR, \%ENV, $sock, FCGI::FAIL_ACCEPT_ON_INTR);

my $global = {
    start_time => time,
    requests   => 0,
    online     => {},
    hour       => {},
    ua         => []
};

while ($request->Accept >= 0) {
    my $req = CGI::Easy::Request->new;
    my $hdr = CGI::Easy::Headers->new;
    my $ses = CGI::Easy::Session->new($req, $hdr);

    my $current_time = time;

    eval {
        if ($req->{path} eq '/stat') {
            my $online = $global->{online};
            my $hour   = $global->{hour};

            if (defined $ses->{id}) {
                $online->{$ses->{id}} = $current_time;
                $hour->{$ses->{id}} = $current_time;
            }

            my $online_count = 0;
            for my $key (%$online) {
                if (($current_time - $online->{$key}) > 1) {
                    delete $online->{$key};
                } else {
                    ++$online_count;
                }
            }

            my $hour_count = 0;
            for my $key (%$hour) {
                if (($current_time - $hour->{$key}) > 60*60) {
                    delete $hour->{$key};
                } else {
                    ++$hour_count;
                }
            }

            $hdr->{'Content-Type'} = 'application/javascript';
            print $hdr->compose();
            print encode_json(
                {
                    uptime   => $current_time - $global->{start_time},
                    requests => $global->{requests},
                    online   => $online_count,
                    ua       => $global->{ua},
                    hour     => $hour_count
                }
            );
        } else {
            $global->{requests}++;

            my $ua = $global->{ua};
            my $iua = $req->{ENV}->{HTTP_USER_AGENT};
            if (defined $iua && $iua && !any {$iua eq $_} @$ua) {
                push @$ua, $iua;
                shift(@$ua) if scalar(@$ua) > 10;
            }

            print $hdr->compose();
            print slurp(File::Spec->catfile($Bin, qw|.. htdocs index.html|));
        }
    };

    if ($@) {
        print $hdr->compose();
        print $@;
    }
}

sub slurp {
    my $fn = shift;

    open(my $fh, '<', $fn) or return '';
    local $/;
    return <$fh>;
}

FCGI::CloseSocket($sock);
