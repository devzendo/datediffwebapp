#!/opt/local/bin/perl -w
# Makes an application manifest file by scanning source code and including
# library code.
use warnings;
use strict;
use Data::Dumper;
use File::Find;

my @scanfiles = ("index.html", "datediff.js", "datediff.css");
my @libdirs = ("lib/iui", "lib/jquery", "lib/mobiscroll");

my @scanned = (map {scan($_)} @scanfiles);

my @found = (map {findFiles($_)} @libdirs);

my @out = (@scanned, @found);
my %uniq = (map { ($_, 1) } @out);
my @uniqfiles = sort(keys (%uniq));

my $out;
open $out, ">cache.manifest" or die "Can't create cache.manifest: $!\n";
print $out "CACHE MANIFEST\n";
foreach (@uniqfiles) { 
	print $out "$_\n";
}
print "cache.manifest created\n";
close $out;

#print Dumper(\@uniqfiles) . "\n";

sub scan {
	my $file = shift;
#	print "scanning $file\n";
	my @out = ($file);
	my $fh;
	open $fh, "<$file";
	die "Can't open $file: $!\n" unless $fh;
	while (<$fh>) {
		chomp;
#		print "[$_]\n";
		if (/<link.*?href="([^"]+)""/ || /<script.*?src="([^"]+)"/ || /<img.*?src="([^"]+)"/ || /background:url\(([^\)]+)\)/ || /\(.*?\)\.attr\("src", *"([^"]+)"\)/ 
		) {
#			print "!!!! found $1\n";
			push @out, $1;
		}
	}
	close $fh;
	return @out;
}

sub findFiles {
	my $dir = shift;
#	print "finding in $dir\n";
    my @out = ();
	my $wanted = sub {
        if (-f $File::Find::name) { 
#            print "filename $File::Find::name\n";
            if ($File::Find::name =~ /(\.DS_Store|ext-sandbox|ext-css)/) {
#                print "$File::Find::name matches ignore regex\n";
            } else {
#            	print "found $File::Find::name\n";
                push @out, $File::Find::name;
            }
        }
    };
	find( {wanted => $wanted, no_chdir => 1}, ($dir));
#	print Dumper(\@out);
	return @out;
}

