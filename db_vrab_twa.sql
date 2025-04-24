create database db_vrab_twa

use db_vrab_twa

create schema eshop


create table eshop.zakaznik(
    id_zakaznik             int                identity,
    meno                    varchar(50)        not null,
    priezvisko              varchar(50)        not null,
    email                   varchar(100)       not null,
    telefon                 varchar(20)        not null,
    ulica                   varchar(100)       not null,
    mesto                   varchar(50)        not null,
    psc                     char(5)            not null,
    datum_registracie       date               not null,
    heslo                   varchar(100)       not null,
    constraint              zakaznik_pk        primary key (id_zakaznik),
    constraint              email_u            unique(email),
    constraint              telefon_u          unique(telefon)
)

-- Tabu¾ka producenta (režiséra) hudby
create table eshop.producent(
    id_producent            int                identity,
    nazov_spolocnosti       varchar(100)       not null,
    meno                    varchar(50)        null,
    priezvisko              varchar(50)        null,
    email                   varchar(100)       null,
    telefon                 varchar(20)        null,
    web                     varchar(100)       null,
    constraint              producent_pk       primary key (id_producent)
)

create table eshop.skladba(
    id_skladby              int                identity,
    nazov                   varchar(100)       not null,
    interpret_meno          varchar(50)        not null,
    interpret_priezvisko    varchar(50)        not null,
    id_producent            int                null,
    rok_vydania             int                not null,
    cena                    decimal(10,2)      not null,
    dostupnost              varchar(20)        not null,
    popis                   text               null,
    zanr                    varchar(50)        null,
    dlzka_min               int                null,
    constraint              skladba_pk         primary key(id_skladby),
    constraint              skladba_ch         check(dostupnost in('Dostupná', 'Nedostupná')),
    constraint              skladba_producent_fk foreign key(id_producent) references eshop.producent(id_producent)
)

-- Tabu¾ka pre košík
create table eshop.kosik(
    id_kosik                int                identity,
    id_zakaznik             int                not null,
    datum_vytvorenia        datetime           not null default getdate(),
    stav                    varchar(20)        not null default 'Aktívny',
    constraint              kosik_pk           primary key(id_kosik),
    constraint              kosik_zakaznik_fk  foreign key(id_zakaznik) references eshop.zakaznik(id_zakaznik),
    constraint              kosik_ch           check(stav in('Aktívny', 'Objednaný', 'Zrušený'))
)

create table eshop.polozka_kosika(
    id_polozka              int                identity,
    id_kosik                int                not null,
    id_skladby              int                not null,
    pocet                   int                not null default 1,
    cena_ks                 decimal(10,2)      not null,
    constraint              polozka_pk         primary key(id_polozka),
    constraint              polozka_kosik_fk   foreign key(id_kosik) references eshop.kosik(id_kosik),
    constraint              polozka_skladba_fk foreign key(id_skladby) references eshop.skladba(id_skladby),
    constraint              pocet_ch           check(pocet > 0)
)

-- Základné výberové dotazy
select * from eshop.zakaznik
select * from eshop.producent
select * from eshop.skladba
select * from eshop.kosik
select * from eshop.polozka_kosika

-- Príklad spojenia tabuliek pre zobrazenie košíka zákazníka s položkami
select 
    k.id_kosik, 
    z.meno + ' ' + z.priezvisko as zakaznik,
    s.nazov as nazov_skladby,
    p.pocet as mnozstvo,
    p.cena_ks as cena_za_kus,
    p.pocet * p.cena_ks as cena_celkom
from 
    eshop.kosik k
    join eshop.zakaznik z on k.id_zakaznik = z.id_zakaznik
    join eshop.polozka_kosika p on k.id_kosik = p.id_kosik
    join eshop.skladba s on p.id_skladby = s.id_skladby
where 
    k.stav = 'Aktívny'
order by 
    k.id_kosik, s.nazov

-- drop database db_vrab_twa