from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
import xml.etree.ElementTree as ET 

from lxml import etree
from io import StringIO
import io 
import xmlschema
    
@csrf_exempt
def dtdExternal(request):
    if request.method == 'POST':
        
        data = json.loads(request.body.decode("utf-8"))
        
        isValid = False
        errorMessage = ""
        notStructured = False
        dtd = etree.DTD(StringIO(data['dtd']))
        try :
            root = etree.XML(data['xml'])
        except etree.XMLSyntaxError :
            notStructured = True
    
        if notStructured:
            errorMessage = "Erreur de syntaxe : Rassurez-vous que votre document xml respecte bien la syntaxe xml"
        else :
            if dtd.validate(root) :
                isValid = True
            else :
                print(str(dtd.error_log.filter_from_errors()[0]))
                errorMessage =  str(dtd.error_log.filter_from_errors()[0])
                isValid = False
    


        data = {
            "isValid": isValid,
            "message": errorMessage
        }
        return JsonResponse(data, status=201)
    else :
        data = {
            "isValid": False,
            "message": "The page were waiting for a post request but get instead"
        }
        return JsonResponse(data, status=201)
        
@csrf_exempt
def schema(request):
    if request.method == 'POST':
        
        data = json.loads(request.body.decode("utf-8"))
        
        isValid = False
        errorMessage = ""
        tested = False
        
        xsd = open('./api/xsd.xsd','w',encoding="utf-8")
        xsd.write(data['xsd'])
        xsd.close()
        
        xml = open('./api/xml.xml','w',encoding="utf-8")
        xml.write(data['xml'])
        xml.close()
        
        try:
            xs= xmlschema.XMLSchema("./api/xsd.xsd")
            isValid = xs.is_valid("./api/xml.xml")
            tested = True
        except etree.ParseError: 
            errorMessage = "Error : Verifier que votre fichier xsd ou xml contient bien du contenu."
        except Exception:
            errorMessage="Error : Verifier que vos fichiers respectent bien les syntaxes sxd et xml."
        if not isValid and tested:
            errorMessage="Votre doucment xml n'est pas valide selon les règles définies dans votre document xsd."
            
        data = {
            "isValid": isValid,
            "message": errorMessage
        }
        return JsonResponse(data, status=201)
    else :
        data = {
            "isValid": False,
            "message": "The page were waiting for a post request but get instead"
        }
        return JsonResponse(data, status=201)     
    
@csrf_exempt
def dtdInternal(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        
        isValid = False
        notStructured = False
        errorMessage = ""
        
        try :
            parser = etree.parse(io.StringIO(data['content']))
            dtd = parser.docinfo.internalDTD
            root = etree.XML(data['content'])
        except etree.XMLSyntaxError :
            notStructured = True
        
        if notStructured:
            errorMessage = "Erreur de syntaxe : Rassurez-vous que votre document xml respecte bien la syntaxe xml. Les tag ouvrants  doivent être bien fermés et bien imbriqués"
        else :
            try :
                if dtd.validate(root) :
                    isValid = True
                else :
                    print(str(dtd.error_log.filter_from_errors()[0]))
                    errorMessage =  str(dtd.error_log.filter_from_errors()[0])
                    isValid = False
            except AttributeError:
                errorMessage = "Votre document ne contient pas de définition de dtd"
                isValid = False
        
        data = {
            "isValid": isValid,
            "message": errorMessage
        }
        return JsonResponse(data, status=201)
    else :
        data = {
            "isValid": False,
            "message": "The page were waiting for a post request but get instead"
        }
        return JsonResponse(data, status=201)  