#!/usr/bin/env python
# -*- coding: utf-8 -*-

#import httplib
import sys
import os
import psycopg2
import psycopg2.extras
import db_config as config
import tempfile

def get_tp_as_ways():
  # Берём все линии ТП:
  try:
    sql="""select way_id,v,version from way_tags where
      k='ref' and 
      cast(way_id as text) || '-' || cast(version as text) in ( select cast(way_id as text) || '-' || cast(max(version) as text) as tt from ways group by way_id) and
      way_id in (select way_id from way_tags where k='power' and v='sub_station')
      """
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    ways = cur_osm.fetchall()
  except:
    print ("I am unable fetch data from db")
    return False
  # Для каждой найденной линии:
  for way in ways:
    way_id=int(way[0])
    name=way[1]
    version=int(way[2])
    # Добавляем линию в список линий для поиска:
    if add_line(way_id, name, "sub_station", version) == False:
      print("Error add_line()")
      return False
  return True

def get_tp_as_nodes():
  lat=0
  lon=0
  # Берём все точки ТП:
  try:
    sql="""select node_id,v,version from node_tags where
      k='ref' and 
      cast(node_id as text) || '-' || cast(version as text) in ( select cast(node_id as text) || '-' || cast(max(version) as text) as tt from nodes group by node_id) and
      node_id in (select node_id from node_tags where k='power' and v='sub_station')
      """
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    nodes = cur_osm.fetchall()
  except:
    print ("I am unable fetch data (stations as nodes) from db")
    return False
  # Для каждой найденной ТП:
  for node in nodes:
    node_id=int(node[0])
    name=node[1]
    version=int(node[2])
    # берём координаты точки:
    try:
      sql="""select latitude,longitude from nodes where
        node_id=%(node_id)d and 
        version=%(version)d""" % {"node_id":node_id, "version":version}
      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      coord = cur_osm.fetchone()
      lat=int(coord[0])
      lon=int(coord[1])
    except:
      print ("I am unable fetch data (node's lat,lon) from db")
      return False
    # Добавляем линию в список линий для поиска:
    if add_new_node(nodes_table_name="nodes", node_id=node_id, name=name, object_type="sub_station", lat=lat,lon=lon) == False:
      print("Error add_new_node()")
      return False
  return True

def get_stations_as_ways():
  # Берём все линии подстанций:
  try:
    sql="""select way_id,v,version from way_tags where
      k='name' and 
      cast(way_id as text) || '-' || cast(version as text) in ( select cast(way_id as text) || '-' || cast(max(version) as text) as tt from ways group by way_id) and
      way_id in (select way_id from way_tags where k='power' and v='station')
      """
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    ways = cur_osm.fetchall()
  except:
    print ("I am unable fetch data from db")
    return False
  # Для каждой найденной линии:
  for way in ways:
    way_id=int(way[0])
    name=way[1]
    version=int(way[2])
    # Добавляем линию в список линий для поиска:
    if add_line(way_id, name, "station", version) == False:
      print("Error add_line()")
      return False
  return True

def get_stations_as_nodes():
  lat=0
  lon=0
  # Берём все точки подстанций:
  try:
    sql="""select node_id,v,version from node_tags where
      k='name' and 
      cast(node_id as text) || '-' || cast(version as text) in ( select cast(node_id as text) || '-' || cast(max(version) as text) as tt from nodes group by node_id) and
      node_id in (select node_id from node_tags where k='power' and v='station')
      """
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    nodes = cur_osm.fetchall()
  except:
    print ("I am unable fetch data (stations as nodes) from db")
    return False
  # Для каждой найденной подстанции:
  for node in nodes:
    node_id=int(node[0])
    name=node[1]
    version=int(node[2])
    # берём координаты точки:
    try:
      sql="""select latitude,longitude from nodes where
        node_id=%(node_id)d and 
        version=%(version)d""" % {"node_id":node_id, "version":version}
      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      coord = cur_osm.fetchone()
      lat=int(coord[0])
      lon=int(coord[1])
    except:
      print ("I am unable fetch data (node's lat,lon) from db")
      return False
    # Добавляем линию в список линий для поиска:
    if add_new_node(nodes_table_name="nodes", node_id=node_id, name=name, object_type="station", lat=lat,lon=lon) == False:
      print("Error add_new_node()")
      return False
  return True

def get_lines_as_relations():
  ways=None
  relations=None
  # Берём все отношения ВЛ:
  try:
    sql="""select relation_id,v,version from relation_tags where
      k='name' and 
      cast(relation_id as text) || '-' || cast(version as text) in ( select cast(relation_id as text) || '-' || cast(max(version) as text) as tt from relations group by relation_id) and
      relation_id in (select relation_id from relation_tags where k='power' and (v='line' or v='construction' or v='cable' or v='minor_line'))
      """
    
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    relations = cur_osm.fetchall()
  except:
    print ("I am unable fetch data from db")
    return False
  # Для каждого найденного отношения:
  for relation in relations:
    relation_id=int(relation[0])
    relation_name=relation[1]
    relation_version=int(relation[2])
    # Берём список членов:
    try:
      sql="""select member_id from relation_members where
      relation_id=%(relation_id)d and
      member_type='Way' and
      version=%(relation_version)d""" % {"relation_id":relation_id, "relation_version":relation_version}

      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      ways = cur_osm.fetchall()
    except:
      print ("I am unable fetch data (member_id's of relation) from db")
      return False

    # Для каждой найденной линии:
    for way in ways:
      way_id=int(way[0])
      name=relation_name
      version=1
      # Для убыстрения процесса - узнаём максимальную версию линии:
      try:
        sql="""select max(version) from ways where
          way_id=%d
          """ % way_id
        if config.debug==True:
          print("sql='%s'" % sql)
        cur_osm.execute(sql)
        version = int(cur_osm.fetchone()[0])
      except:
        print ("I am unable fetch data (way's version) from db")
        return False

      # Добавляем линию в список линий для поиска:
      if add_line(way_id, name, "line", version) == False:
        print("Error add_line()")
        return False
  return True

def get_lines_as_ways():
  # Берём все линии ВЛ:
  try:
    sql="""select way_id,v,version from way_tags where
      k='name' and 
      cast(way_id as text) || '-' || cast(version as text) in ( select cast(way_id as text) || '-' || cast(max(version) as text) as tt from ways group by way_id) and
      way_id in (select way_id from way_tags where k='power' and (v='line' or v='construction' or v='cable' or v='minor_line'))
      """
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    ways = cur_osm.fetchall()
  except:
    print ("I am unable fetch data from db")
    return False
  # Для каждой найденной линии:
  for way in ways:
    way_id=int(way[0])
    name=way[1]
    version=int(way[2])
    # Добавляем линию в список линий для поиска:
    if add_line(way_id, name,"line", version) == False:
      print("Error add_line()")
      return False
  return True

def get_nodes_of_way(ways_table_name, way_id, object_type):
  lat=0
  lon=0
  version=1
  nodes_table_name=""
  # Берём имя таблицы и версию линии (для убыстрения поиска) в базе ОСМ для этой линии:
  try:
    sql="""select nodes_table_name,version from %(ways_table_name)s where
      way_id=%(way_id)d
      """ % {"ways_table_name":ways_table_name, "way_id":way_id}
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_search.execute(sql)
    data = cur_search.fetchone()
    nodes_table_name = data[0]
    version = data[1]
  except:
    print ("I am unable fetch table_name for way_id=%d from db 'lines'" % way_id)
    return False

  # Берём точки линии:
  try:
    sql="""select node_id from way_nodes where
    way_id=%(way_id)d and
    version=%(version)d""" % {"way_id":way_id, "version":version}
    #cast(way_id as text) || '-' || cast(version as text) in ( select cast(way_id as text) || '-' || cast(max(version) as text) as tt from way_nodes group by way_id)
    #""" % way_id

    if config.debug==True:
      print("sql='%s'" % sql)
    cur_osm.execute(sql)
    nodes = cur_osm.fetchall()
  except:
    print ("I am unable fetch data (way's nodes) from db")
    return False

  # Для каждой точки линии:
  for node in nodes:
    node_id=int(node[0])
    name=""
    ele="0"
    disconnector_type=""
    version=1
    # Для убыстрения процесса - узнаём максимальную версию точки:
    try:
      sql="""select max(version) from nodes where
        node_id=%d
        """ % node_id
      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      version = int(cur_osm.fetchone()[0])
    except:
      print ("I am unable fetch data (node's version) from db")
      return False
    # берём координаты точки:
    try:
      sql="""select latitude,longitude from nodes where
        node_id=%(node_id)d and 
        version=%(version)d""" % {"node_id":node_id, "version":version}
        #cast(node_id as text) || '-' || cast(version as text) in ( select cast(node_id as text) || '-' || cast(max(version) as text) as tt from nodes group by node_id)
        #""" % node_id
      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      coord = cur_osm.fetchone()
      lat=int(coord[0])
      lon=int(coord[1])
    except:
      print ("I am unable fetch data (node's lat,lon) from db")
      return False

    # берём имя точки (ref):
    name=get_tag("ref",node_id,version)
    if name == None:
      print ("Error get_tag('ref')")
      name=""

    # берём высоту точки (ele):
    ele=get_tag("ele",node_id,version)
    if ele == None:
      print ("Error get_tag('ele')")
      ele="0"

    # берём тип разъеденителя (disconnector):
    disconnector_type=get_tag("disconnector",node_id,version)
    if disconnector_type == None:
      print ("Error get_tag('disconnector')")
      disconnector_type=""

    # Тип точки - на основе way:
    node_type="none"
    if object_type=="line":
      node_type="tower"
    elif object_type=="minor_line":
      node_type="pole"

    # Добавляем опору в таблицу поиска для этой линии:
    if add_new_node(nodes_table_name=nodes_table_name,node_id=node_id,name=name,object_type=node_type, disconnector_type=disconnector_type,lat=lat,lon=lon,ele=ele) == False:
      print("Error add_new_node()")
      return False
  return True

def get_tag(tag_name, node_id, version):
    tag_value=""
    try:
      sql="""select v from node_tags where
        k='%(tag_name)s' and 
        node_id=%(node_id)d and
        version=%(version)d""" % {"tag_name":tag_name,"node_id":node_id, "version":version}
      if config.debug==True:
        print("sql='%s'" % sql)
      cur_osm.execute(sql)
      data = cur_osm.fetchone()
      if config.debug==True:
        print("data=", data)
      if data != None:
        # Точка имеет название (теги):
        tag_value = data[0]
    except:
      print ("I am unable fetch (node's tags) data from db.")
      return None
    return tag_value


def add_new_node(nodes_table_name, node_id, lat,lon, name="", object_type="none", disconnector_type="", ele="0"):
  global cur_search
  global conn_search
  try:
    sql="""INSERT INTO %(nodes_table_name)s (node_id, name, object_type, disconnector_type, lat, lon, ele) VALUES (%(node_id)d, '%(name)s', '%(object_type)s', '%(disconnector_type)s', %(lat)d, %(lon)d, '%(ele)s')""" % {"nodes_table_name":nodes_table_name, "disconnector_type":disconnector_type, "node_id":node_id, "name":name, "object_type":object_type, "lat":lat, "lon":lon, "ele":ele}
    if config.debug==True:
      print("sql='%s'" % sql)
    cur_search.execute(sql)
    conn_search.commit()
  except:
    print ("I am unable insert node into table '%s'!" % nodes_table_name)
    return False
  return True


def recreate_db():
  global cur_search
  global conn_search
  tables=[]
  nodes_tables=[]
  ways_tables=[]
# удаляем все таблицы линий:
  try:
    sql="""select ways_table_name from lines"""
    cur_search.execute(sql)
    ways_tables=cur_search.fetchall()
    conn_search.commit()
  except:
    print ("I am unable fetch data from db lines is empty or not exist! Skip.")
    conn_search.rollback()

  for ways_table in ways_tables:
    ways_table_name=ways_table[0]
    # Берём все таблицы nodes:
    try:
      sql="""select nodes_table_name from %(ways_table_name)s""" % {"ways_table_name":ways_table_name}
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      nodes_tables = cur_search.fetchall()
    except:
      print ("I am unable search nodes_table_name in '%s'!" % ways_table_name)
      continue
    for nodes_table in nodes_tables:
      nodes_table_name=nodes_table[0]
      # удаляем все табилцы nodes для всех таблиц ways
      try:
        sql="""DROP TABLE IF EXISTS %s""" % nodes_table_name
        if config.debug==True:
          print("DEBUG: sql=",sql)
        cur_search.execute(sql)
        conn_search.commit()
      except:
        print ("I am unable drop table '%s' from db"% nodes_table_name)
        continue

    # Удаляем таблицы ways:
    try:
      sql="""DROP TABLE IF EXISTS %s""" % ways_table_name
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      conn_search.commit()
    except:
      print ("I am unable drop table '%s' from db"% ways_table_name)
      return False

# пересоздаём таблицу линий:
  try:
    sql="""drop table IF EXISTS lines"""
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    conn_search.commit()
    sql="""CREATE TABLE lines (
      id serial primary key,
      name text,
      object_type text,
      ways_table_name varchar(255) )
    """
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    conn_search.commit()
  except:
    print ("I am unable recreate table 'lines' in %s!" % config.db_search_name)
    return False

# пересоздаём таблицу точек:
  try:
    sql="""drop table IF EXISTS nodes"""
    cur_search.execute(sql)
    conn_search.commit()
    sql="""CREATE TABLE nodes (
      id serial primary key,
      node_id bigint NOT NULL,
      name text,
      object_type text,
      disconnector_type text,
      ele text,
      lat integer NOT NULL,
      lon integer NOT NULL) 
    """
    cur_search.execute(sql)
    conn_search.commit()
  except:
    print ("I am unable create table 'nodes' in %s!" % config.db_search_name)
    return False

  return True

def add_line(way_id,name,object_type,version):
  line_id=0
  ways_table_name=""
  ways_table_exist=False
# Определяем, есть ли линии в таблице с таким же именем:
  try:
    sql="""select ways_table_name from lines where name='%(name)s'""" % {"name":name}
    if config.debug==True:
      print("DEBUG: sql='%s'" % sql)
    cur_search.execute(sql)
    data = cur_search.fetchone()
    if config.debug==True:
      print("DEBUG: data=" , data)
    if data !=None:
      ways_table_name=data[0]
      ways_table_exist=True
  except:
    print ("I am unable search ways_table_name in 'lines'!")
    return False

  if ways_table_exist == True:
    # добавляем в существующую:
    if add_way(ways_table_name,way_id,object_type,version) == False:
      print("Error add_way()")
      return False
  else:
    # Добавляем запись:
    try:
      sql="""INSERT INTO lines (name, object_type, ways_table_name) VALUES ('%(name)s','%(object_type)s', '%(ways_table_name)s')""" % {"name":name, "object_type":object_type, "ways_table_name":ways_table_name}
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      conn_search.commit()
    except:
      print ("I am unable insert item into table 'lines'!")
      return False
    # Получаем идентификатор созданноё записи:
    try:
      sql="""select id from lines where name='%(name)s'""" % {"name":name}
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      data = cur_search.fetchone()
      if data !=None:
        line_id=int(data[0])
        ways_table_name="ways_of_line_%d" % line_id
      else:
        # не смогли получить идентификатор только что созданноё записи - ошибка!
        print ("I am unable search id in 'lines'!")
        return False
    except:
      print ("I am unable search id in 'lines'!")
      return False
    # Обновляем имя таблицы в только что добавленной записи (имя состоит из префикса и идентификатора записи):
    try:
      sql="""update lines set ways_table_name='%(ways_table_name)s' where id=%(line_id)d
        """ % {"ways_table_name":ways_table_name, "line_id":line_id}
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      conn_search.commit()
    except:
      print ("I am unable update table 'lines' where id=%d!" % line_id)
      return False

    # создаём таблицу ways (путей) для добавленной линии:
    try:
      sql="""CREATE TABLE %(ways_table_name)s (
        id serial primary key,
        way_id bigint NOT NULL,
        version bigint NOT NULL,
        object_type text,
        nodes_table_name text
        )""" % {"ways_table_name":ways_table_name}
      if config.debug==True:
        print("DEBUG: sql=",sql)
      cur_search.execute(sql)
      conn_search.commit()
    except:
      print ("I am unable create table '%s'!" % ways_table_name)
      return False
    
    # добавляем way в созданную таблицу:
    if add_way(ways_table_name,way_id,object_type,version) == False:
      print("Error add_way()")
      return False

  return True

def add_way(ways_table_name,way_id,object_type,version):
  global cur_search
  global conn_search
  nodes_table_exist=False
  nodes_table_name="nodes_of_way_%d" % way_id
  # Определяем, есть ли в таблице way данной line - подобная линия:
  try:
    sql="""select nodes_table_name from %(ways_table_name)s where way_id=%(way_id)d""" % {"ways_table_name":ways_table_name, "way_id": way_id}
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    data = cur_search.fetchone()
    if data !=None:
      # Раз есть, то не добавляем ещё раз, считаем, что уже добавлено:
      return True
  except:
    print ("I am unable search nodes_table_name in '%s'!" % ways_table_name)
    return False

  # Добавляем запись о новой таблице точек для добавляемого пути (way):
  try:
    sql="""INSERT INTO %(ways_table_name)s (way_id, version, object_type, nodes_table_name) VALUES (%(way_id)d, %(version)d, '%(object_type)s', '%(nodes_table_name)s')""" % {\
      "ways_table_name":ways_table_name, "way_id":way_id, "version":version, "object_type":object_type, "nodes_table_name":nodes_table_name}
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    conn_search.commit()
  except:
    print ("I am unable insert way into table '%s'!" % ways_table_name)
    return False

  # Т.к. добавленное отношение может ссылаться на way, который уже был добавлен в список (way может быть частью разных отношений и принадлежать разным линиям), то нужно проверить существует ли уже такая таблица,
  # если да, то не создаём таблицу:
  try:
    sql="""SELECT EXISTS (SELECT 1
      FROM  information_schema.tables WHERE 
      table_schema = 'public' AND
      table_name = '%(nodes_table_name)s')
      """ % {"nodes_table_name":nodes_table_name}
    #sql="""select * from %s limit 1""" % table_name
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    reply = "%s" % cur_search.fetchone()
    if config.debug==True:
      print("DEBUG: reply=",reply)
      print("DEBUG: reply='%s'" % reply)
    if reply == 'True':
      nodes_table_exist=True
      if config.debug==True:
        print("DEBUG: Table '%s' exist - skip!" % nodes_table_name)
      return True
  except:
    print ("I am unable check table '%s' exist!" % table_name)
    return False
  # создаём таблицу:
  try:
    sql="""CREATE TABLE %(nodes_table_name)s (
      id serial primary key,
      node_id bigint NOT NULL,
      name text,
      object_type text,
      disconnector_type text,
      ele text,
      lat integer NOT NULL,
      lon integer NOT NULL)""" % {"nodes_table_name":nodes_table_name}
    if config.debug==True:
      print("DEBUG: sql=",sql)
    cur_search.execute(sql)
    conn_search.commit()
  except:
    print ("I am unable create table '%s'!" % nodes_table_name)
    return False
  # Добавляем все точки этой линии в таблицу опор этой линии:
  if get_nodes_of_way(ways_table_name, way_id, object_type) == False:
    print("Error get_nodes_of_way()")
    return False
  return True


def connect_to_osm_db():
  global conn_osm
  global cur_osm
  try:
    if config.debug:
      print("connect to: dbname='" + config.db_osm_name + "' user='" +config.db_osm_user + "' host='" + config.db_osm_host + "' password='" + config.db_osm_passwd + "'")
    conn_osm = psycopg2.connect("dbname='" + config.db_osm_name + "' user='" +config.db_osm_user + "' host='" + config.db_osm_host + "' password='" + config.db_osm_passwd + "'")
    cur_osm = conn_osm.cursor()
  except:
    print ("I am unable to connect to the database");return False
  return True

def connect_to_search_db():
  global conn_search
  global cur_search
  try:
    if config.debug:
      print("connect to: dbname='" + config.db_search_name + "' user='" +config.db_search_user + "' host='" + config.db_search_host + "' password='" + config.db_search_passwd + "'")
    conn_search = psycopg2.connect("dbname='" + config.db_search_name + "' user='" +config.db_search_user + "' host='" + config.db_search_host + "' password='" + config.db_search_passwd + "'")
    cur_search = conn_search.cursor()
  except:
    print ("I am unable to connect to the database");return False
  return True
  

# ======================================= main() ===========================
conn_osm=0
cur_osm=0
conn_search=0
cur_search=0

print("Start create search db...")

if connect_to_search_db() == False:
  print("Error connect_to_search_db()")
  sys.exit(1)

if connect_to_osm_db() == False:
  print("Error connect_to_osm_db()")
  sys.exit(1)

# Очищаем базу:
if recreate_db() == False:
  print("Error recreate_db()")
  sys.exit(1)

# Линии
# Добавляем простые линии:
if get_lines_as_ways() == False:
  print("Error get_lines_as_ways()")  
  sys.exit(1)

# Добавляем линии как отношения:
if get_lines_as_relations() == False:
  print("Error get_lines_as_relations()")
  sys.exit(1)

# Подстанции
if get_stations_as_ways() == False:
  print("Error get_stations_as_ways()")
  sys.exit(1)
if get_stations_as_nodes() == False:
  print("Error get_stations_as_nodes()")
  sys.exit(1)

# ТП
if get_tp_as_ways() == False:
  print("Error get_tp_as_ways()")
  sys.exit(1)
if get_tp_as_nodes() == False:
  print("Error get_tp_as_nodes()")
  sys.exit(1)

print("Success create search db!")
sys.exit(0)
