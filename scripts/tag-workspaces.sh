#!/bin/sh

: ${MANIFEST:=package.json}

while getopts nv option; do
    case "${option}" in
    n) DRYRUN=1 ;;
    v) VERBOSE=1 ;;
    *) exit 2 ;;
    esac
done
shift "$((${OPTIND} - 1))"

WORKSPACES="$@"
test "${WORKSPACES}" = "" && echo Workspace list cannot be empty >&2 && exit 1

for workspace in ${WORKSPACES}; do
    test "${VERBOSE}" = "1" && echo "workspace: $(realpath ${workspace})"

    name="$(sed -En 's/.*"name": "(.+)".*/\1/p' ${workspace}/${MANIFEST} | head -1)"
    test "${name}" = "" && echo "Cannot parse name for workspace \"${workspace}\"" >&2 && exit 1
    test "${VERBOSE}" = "1" && echo "name: ${name}"

    version="$(sed -En 's/.*"version": "(.+)".*/\1/p' ${workspace}/${MANIFEST} | head -1)"
    test "${version}" = "" && echo "Cannot parse version for workspace \"${workspace}\"" >&2 && exit 1
    test "${VERBOSE}" = "1" && echo "version: ${version}"

    test "${DRYRUN}" = "1" &&
        echo sed -i "/\"$(echo ${name} | sed 's,/,\\/,g')\"/ s/\*/^${version}/" "${workspace}"/../*/"${MANIFEST}" ||
        sed -i "/\"$(echo ${name} | sed 's,/,\\/,g')\"/ s/\*/^${version}/" "${workspace}"/../*/"${MANIFEST}"
done
