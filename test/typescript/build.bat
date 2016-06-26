@echo off

SET PARAMS=--target es6 --module commonjs --noImplicitAny

call tsc batch %PARAMS%
call tsc page %PARAMS%
call tsc sequence %PARAMS%
call tsc stream %PARAMS%
