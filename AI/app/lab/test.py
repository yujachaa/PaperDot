import jpype
from konlpy.tag import Okt

# JVM 경로를 직접 지정 (JAVA_HOME이 올바르게 설정되었으면 자동으로 처리됨)
jvmpath = jpype.getDefaultJVMPath()

# JVM 초기화
jpype.startJVM(jvmpath)

# KoNLPy 사용
okt = Okt()


# import os
# from konlpy import utils


# javadir = '%s%sjava' % (utils.installpath, os.sep)
# args = [javadir, os.sep]
# folder_suffix = ['{0}{1}open-korean-text-2.1.0.jar']
# classpath = [f.format(*args) for f in folder_suffix]

# print('javadir  : {}'.format(javadir))
# print('os.sep   : {}'.format(os.sep))
# print('classpath: {}'.format(classpath[0]))