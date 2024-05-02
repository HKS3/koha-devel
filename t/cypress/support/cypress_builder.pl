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

my %data;
my $class;

GetOptions( "data=s" => \%data, "class=s" => \$class );

my $builder = t::lib::TestBuilder->new;

my $koha_object = $builder->build_object({ class => $class, value => \%data });