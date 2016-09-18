
import urllib2
import json


site = 'http://openstreetmap.ru'

# format: 
#   n+id lat lon q
tests = 'test_search.txt'



def check_result(result, obj):
	if result['find'] != True: return False
	osm_id_type = 'osm_id_' + obj[0]
	osm_id = obj[1:]
	for res in result['matches']:
		if osm_id in res[osm_id_type]: return True
	return False


sum = {'n':0, 'true':0, 'false':0}

for l in open(tests).xreadlines():
	sum['n'] += 1
	obj, lat, lon, q = l.strip('\n').split(' ', 3)
	
	q0 = q.replace(' ', '+')
	url = '%s/api/search?q=%s&lat=%s&lon=%s' %(site, q0, lat, lon)
	json_data = urllib2.urlopen(url).read()
	data = json.loads(json_data)
	print q,
	res = check_result(data, obj)

	if res:
		print ' OK'
		sum['true'] += 1
	else:
		print ' FAIL'
		sum['false'] += 1

print 'sum:', str(sum)
