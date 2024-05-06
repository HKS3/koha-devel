#!/usr/bin/perl

# This file is part of Koha.
#
# Koha is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# Koha is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Koha; if not, see <http://www.gnu.org/licenses>.

use Modern::Perl;

use Koha::Database;

use t::lib::TestBuilder;
use JSON qw( decode_json );
use Getopt::Long;
use Koha::Patrons;
use Koha::Libraries;
use Koha::Patron::Category;

my %data;
my $class;
my $teardown;

=head1 DESCRIPTION

creates/deletes Koha Objects via command line, for each object to create an id has to be provided

create:
perl t/cypress/support/cypress_builder.pl  --class Koha::Patrons --data cardnumber=999 --data firstname=Mark

teardown:
perl t/cypress/support/cypress_builder.pl  --class Koha::Patrons --data cardnumber=999 --data firstname=Mark --teardown

=cut

GetOptions( "data=s" => \%data, "class=s" => \$class, "teardown" => \$teardown);

my $builder = t::lib::TestBuilder->new;

my $objects = {
    "Koha::Patrons" => { id => 'cardnumber', teardown => 'patron_delete',},
};

die unless $data{$objects->{$class}->{id}};

if ($teardown) {
    my $sub = $objects->{$class}->{teardown};
    no strict 'refs';
    &$sub($data{$objects->{$class}->{id}});
} else {
    my $koha_object = $builder->build_object({ class => $class, value => \%data });
}

sub patron_delete {
    my $id = shift;
    my $patron = Koha::Patrons->find( {cardnumber => $id });
    my $branch = Koha::Libraries->find( {branchcode => $patron->branchcode });
   
    $builder->delete({ source => 'Borrower',  records => $patron});
    $builder->delete({ source => 'Branch',  records => $branch});   
    $builder->delete({ source => 'Category',  records => $patron->category});   
}