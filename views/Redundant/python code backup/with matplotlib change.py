#!/usr/bin/python
__name__ = '__main__'
import os
import sys
import numpy as np

import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')

import matplotlib.pyplot as plt


def get_plot_files(file):
    open_file = open(os.path.realpath(file),'r')
    raw_data = open_file.read()
    array = raw_data.split('* ')

    array.pop(0)
    dict_data = {}
    parameters = []
    parsed_files = []
    for i in range(len(array)):
        dict_data[i] = array[i]
        
        sample = dict_data[i].split('\n')

        write_file = open('parsed_%s.txt'%(i),'w')
        
        for j in sample[3:]:

            if j.startswith('Index'):
                items = j.split()
                parameters.append(items) if len(parameters) < i+1 else None
                continue
            if j.startswith('--'): #or j.startswith('/home') or j.startswith('Transient') or j.startswith(' Transient'):
                continue
            else:   
                write_file.write(j+'\n')

        parsed_files.append('parsed_%s.txt'%(i))
    return parameters, parsed_files
    
    


def mai1n():

    file = sys.argv[1]
    parameters, parsed_files = get_plot_files(file)

    for plot_file in parsed_files:
      
        for item in parameters:
            data= np.loadtxt(plot_file, unpack= True, dtype= str)

            for i in range(2, len(data)):
                plt.figure(i-1), plt.plot(data[1], data[i])
                plt.xlabel(item[1]), plt.ylabel(item[i])
                #plt.title('%s => %s  vs  %s'%(plot_file,item[1], item[i]))
                plt.savefig(plot_file+str(i)+'.png')


mai1n()
