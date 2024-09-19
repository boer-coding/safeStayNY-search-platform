create table host(
    host_id    int          not null primary key,
    host_name  varchar(70)  not null,
    join_since varchar(20)  not null,
    super_host TINYINT(1)   not null,
    host_url   varchar(200) not null,
    pic_url    varchar(300) not null
);

create table location( 
    location_id        int          not null primary key,
    neighborhood       varchar(100) not null,
    neighborhood_group varchar(20)  not null
);


create table review(
    review_id            int           not null primary key,
    review_num           int           null,
    review_rating        decimal(3, 2) null,
    review_accuracy      decimal(3, 2) null,
    review_clean         decimal(3, 2) null,
    review_checkin       decimal(3, 2) null,
    review_communication decimal(3, 2) null,
    review_location      decimal(3, 2) null,
    review_value         decimal(3, 2) null
);


create table airbnb(
    listing_id   int   primary key,
    listing_des  varchar(120)                                                          null,
    host_id      int                                                                   not null,
    room_type    enum ('Entire home/apt', 'Private room', 'Hotel room', 'Shared room') not null,
    price        int                                                                   null,
    mini_nights  int                                                                   null,
    location_id  int                                                                   not null,
    latitude     decimal(7, 5)                                                         not null,
    longitude    decimal(7, 5)                                                         not null,
    review_id    int                                                                   not null,
    max_nights   int                                                                   null,
    listing_url  varchar(300)                                                          null,
    accommodates int                                                                   null,
    bathrooms    int                                                                   null,
    beds         int                                                                   null,
    constraint airbnb_ibfk_1
        foreign key (host_id) references host (host_id),
    constraint airbnb_ibfk_2
        foreign key (location_id) references location (location_id),
    constraint airbnb_ibfk_3
        foreign key (review_id) references review (review_id)
);

create table offense_description(
    ky_cd     int         not null primary key,
    ofns_type varchar(60) not null
);

create table police_department_description(
    pd_cd   int          not null primary key,
    pd_type varchar(120) null
);

create table suspect(
    type_id   int  primary key,
    age_group enum ('<18', '18-24', '25-44', '45-64', '65+')                                                                                       not null,
    gender    enum ('F', 'M', 'U')                                                                                                                 not null,
    race      enum ('BLACK', 'WHITE', 'WHITE HISPANIC', 'BLACK HISPANIC', 'ASIAN / PACIFIC ISLANDER', 'UNKNOWN', 'AMERICAN INDIAN/ALASKAN NATIVE') not null
);

create table arrest_list(
    arrest_id   int           not null primary key,
    arrest_date varchar(10)   not null,
    latitude    decimal(8, 6) not null,
    longitude   decimal(8, 6) not null,
    type_id     int           not null,
    ky_cd       int           null,
    pd_cd       int           not null,
    location_id int           not null,
    constraint arrest_list_ibfk_1
        foreign key (pd_cd) references police_department_description (pd_cd),
    constraint arrest_list_ibfk_2
        foreign key (type_id) references suspect (type_id),
    constraint arrest_list_ibfk_3
        foreign key (location_id) references location (location_id),
    constraint arrest_list_ibfk_4
        foreign key (ky_cd) references offense_description (ky_cd)
);
