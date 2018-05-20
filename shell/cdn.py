#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import sys, os
import datetime
import time

# 当前文件路径，是指命令行所执行的路径
pwd = os.getcwd()

#当前文件的父路径
father_path=os.path.abspath(os.path.dirname(pwd)+os.path.sep+".")

#当前文件的前两级目录
grader_father=os.path.abspath(os.path.dirname(pwd)+os.path.sep+"..")

# 获取指定目录下文件列表
def listFiles(dirPath):
    fileList=[]

    # 返回一个三元组，遍历的路径、当前遍历路径下的目录、当前遍历目录下的文件名
    for root,dirs,files in os.walk(dirPath):
        for fileObj in files:
            fileList.append(os.path.join(root,fileObj))

    return fileList

# 替换制定字符串
def replace():
    now = datetime.datetime.now()
    print("shell: cdn 替换开始 [" + str(now) + "]")

    fileDir = pwd + "/dist/static/css"

    # 正则表达式
    # regex = ur'FUNC_SYS_ADD_ACCDETAIL'

    fileList = listFiles(fileDir)

    for fileObj in fileList:
        # r+:  可读可写，若文件不存在，报错
    	# w+: 可读可写，若文件不存在，创建

        f = open(fileObj,'r+')

        # readlines()每次按行读取整个文件内容，将读取到的内容放到一个列表中，返回list类型
        all_the_lines=f.readlines()

        # seek()函数回到文件头部，因为迭代器已经访问完了文件的所有行
        f.seek(0)

        # 清空文件内容
        # 仅当以 "r+"   "rb+"    "w"   "wb" "wb+"等以可写模式打开的文件才可以执行该功能
        f.truncate()

        for line in all_the_lines:
            # 链式replace()
            f.write(line.replace('static/images','../images').\
                replace('static/fonts', '../fonts').\
                replace('static/medias', '../medias'))

        f.close()

        now = datetime.datetime.now()
        print("shell: cdn 替换结束 [" + str(now) + "]")

# 启动
if __name__ == "__main__":
    replace()
