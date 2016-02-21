import urllib2, bottle, json
from bs4 import BeautifulSoup

url_base = "http://richpreview.com/"

@bottle.hook('after_request')
def enable_cors():
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'

@bottle.route('/preview/<url>')
def index(url):
    url = urllib2.unquote(url).decode('utf8')
    full_url = url_base + ('?url=https://' + url).encode('utf8')
    response = urllib2.urlopen(full_url).read()
    soup = BeautifulSoup(response)
    snippet = soup.findAll("div", class_="telegram-rich")[0]
    title = snippet.findAll("span", class_="titel")[0].text
    description = snippet.findAll("span", class_="description")[0].text

    image_link = snippet.findAll("span", class_="brand")[0]['style']
    image_link = image_link[image_link.find(':'):].split("'")[1]

    return json.dumps({
        'title' : title,
        'description' : description,
        'image_link' : image_link
        })

bottle.run(host='localhost', port=8080)
